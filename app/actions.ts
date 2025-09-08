'use server';

import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sanitizeInput, publishToGitHub } from '../utils';

export interface Draft {
  id: number;
  title: string;
  body: string;
}

interface GithubConfig {
  username: string;
  repo: string;
  token: string;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  automaticDeserialization: false,
});

const DRAFTS_KEY = 'drafts';
const GITHUB_CONFIG_KEY = 'github_config';
const SUCCESS_FLAG_KEY = 'success_flag';

export async function loadDrafts(): Promise<Draft[]> {
  try {
    const data = await redis.get<string>(DRAFTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading drafts from Redis:', error);
    return [];
  }
}

async function saveDrafts(drafts: Draft[]) {
  try {
    const jsonString = JSON.stringify(drafts, null, 2);
    console.log('Saving drafts JSON:', jsonString); // Debug log
    await redis.set(DRAFTS_KEY, jsonString);
  } catch (error) {
    console.error('Error saving drafts to Redis:', error);
    throw new Error('Failed to save drafts');
  }
}

async function saveGithubConfig(config: GithubConfig) {
  try {
    const jsonString = JSON.stringify(config, null, 2);
    console.log('Saving GitHub config JSON:', jsonString); // Debug log
    await redis.set(GITHUB_CONFIG_KEY, jsonString);
  } catch (error) {
    console.error('Error saving GitHub config to Redis:', error);
    throw new Error('Failed to save GitHub config');
  }
}

export async function loadGithubConfig(): Promise<GithubConfig | null> {
  try {
    const data = await redis.get<string>(GITHUB_CONFIG_KEY);
    console.log('Raw GitHub config from Redis:', data); // Debug log
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading GitHub config from Redis:', error);
    return null;
  }
}

export async function addDraft(formData: FormData) {
  const title = sanitizeInput(formData.get('title') as string || '');
  const body = sanitizeInput(formData.get('body') as string || '');
  const drafts = await loadDrafts();
  if (title && body) {
    drafts.push({ id: Date.now(), title, body });
    await saveDrafts(drafts);
  }
  revalidatePath('/');
}

export async function deleteDraft(formData: FormData) {
  const id = Number(formData.get('id'));
  let drafts = await loadDrafts();
  drafts = drafts.filter(draft => draft.id !== id);
  await saveDrafts(drafts);
  revalidatePath('/');
}

export async function editDraft(formData: FormData) {
  const id = Number(formData.get('id'));
  const title = sanitizeInput(formData.get('title') as string || '');
  const body = sanitizeInput(formData.get('body') as string || '');
  let drafts = await loadDrafts();
  if (title && body) {
    drafts = drafts.map(draft =>
      draft.id === id ? { ...draft, title, body } : draft
    );
    await saveDrafts(drafts);
  }
  revalidatePath('/');
  redirect('/'); // Redirect to clear query parameters after saving
}

export async function cancelEdit() {
  redirect('/?cancelEdit=true'); // Redirect to clear editDraftId
}

export async function publishAll(formData: FormData) {
  let username = sanitizeInput(formData.get('username') as string || '');
  let repo = sanitizeInput(formData.get('repo') as string || '');
  let token = formData.get('token') as string || '';

  // Load from Redis if not provided in form
  if (!username || !repo || !token) {
    const config = await loadGithubConfig();
    if (config) {
      username = config.username;
      repo = config.repo;
      token = config.token;
    }
  }

  if (!username || !repo || !token) {
    throw new Error('Missing GitHub username, repository, or token. Provide in form or store in Redis.');
  }

  const drafts = await loadDrafts();
  const repoPath = `${username}/${repo}`;
  const basePath = 'contents';
  try {
    await publishToGitHub(drafts, repoPath, basePath, token);
    await saveDrafts([]);
    await redis.set(SUCCESS_FLAG_KEY, '1');
    revalidatePath('/');
  } catch (error) {
    console.error('Publish error:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Failed to publish: ${errorMessage}`);
  }
}

export async function updateMarkdown(formData: FormData) {
  'use server';
  const username = sanitizeInput(formData.get('username') as string || '');
  const repo = sanitizeInput(formData.get('repo') as string || '');
  const token = formData.get('token') as string || '';
  const file = sanitizeInput(formData.get('file') as string || '');
  if (!username || !repo || !token || !file) {
    throw new Error('Missing GitHub username, repository, token, or file name.');
  }

  // Save GitHub config to Redis
  await saveGithubConfig({ username, repo, token });

  redirect(`/?username=${encodeURIComponent(username)}&repo=${encodeURIComponent(repo)}&token=${encodeURIComponent(token)}&file=${encodeURIComponent(file)}`);
}
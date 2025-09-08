// actions.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sanitizeInput, publishToGitHub } from '../utils';

export interface Draft {
  id: number;
  title: string;
  body: string;
}

const draftsFilePath = path.join(process.cwd(), 'data', 'drafts.json');
const successFlagPath = path.join(process.cwd(), 'data', 'success.flag');

export async function loadDrafts(): Promise<Draft[]> {
  try {
    const data = await fs.readFile(draftsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveDrafts(drafts: Draft[]) {
  const dir = path.dirname(draftsFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(draftsFilePath, JSON.stringify(drafts, null, 2));
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
  const username = sanitizeInput(formData.get('username') as string || '');
  const repo = sanitizeInput(formData.get('repo') as string || '');
  const token = formData.get('token') as string || '';
  if (!username || !repo || !token) {
    throw new Error('Missing GitHub username, repository, or token.');
  }
  const drafts = await loadDrafts();
  const repoPath = `${username}/${repo}`;
  const basePath = 'contents';
  try {
    await publishToGitHub(drafts, repoPath, basePath, token);
    await saveDrafts([]);
    await fs.writeFile(successFlagPath, '');
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
  redirect(`/?username=${encodeURIComponent(username)}&repo=${encodeURIComponent(repo)}&token=${encodeURIComponent(token)}&file=${encodeURIComponent(file)}`);
}
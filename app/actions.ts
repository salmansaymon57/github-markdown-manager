'use server';

import { put, del, head } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sanitizeInput, publishToGitHub } from '../utils';

export interface Draft {
  id: number;
  title: string;
  body: string;
}

const DRAFTS_BLOB_NAME = 'drafts.json';
const SUCCESS_FLAG_BLOB_NAME = 'success.flag';

export async function loadDrafts(): Promise<Draft[]> {
  try {
    const blobMetadata = await head(DRAFTS_BLOB_NAME, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!blobMetadata) return [];
    const response = await fetch(blobMetadata.url);
    if (!response.ok) throw new Error(`Failed to fetch blob content: ${response.statusText}`);
    const data = await response.text();
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading drafts from Blob:', error);
    return [];
  }
}

async function saveDrafts(drafts: Draft[]) {
  try {
    await put(DRAFTS_BLOB_NAME, JSON.stringify(drafts, null, 2), { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (error) {
    console.error('Error saving drafts to Blob:', error);
    throw new Error('Failed to save drafts');
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
    const { url } = await put(SUCCESS_FLAG_BLOB_NAME, '1', { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
    revalidatePath('/');
    return url; // Return the URL for use in del
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
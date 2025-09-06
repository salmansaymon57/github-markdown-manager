'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { sanitizeInput, publishToGitHub } from '../utils';

interface Draft {
  id: number;
  title: string;
  body: string;
}

const draftsFilePath = path.join(process.cwd(), 'data', 'drafts.json');

// Load drafts from JSON file
export async function loadDrafts(): Promise<Draft[]> {
  try {
    const data = await fs.readFile(draftsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save drafts to JSON file
async function saveDrafts(drafts: Draft[]) {
  const dir = path.dirname(draftsFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(draftsFilePath, JSON.stringify(drafts, null, 2));
}

// Server Actions
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
}

export async function publishAll(formData: FormData) {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token is missing. Please set NEXT_PUBLIC_GITHUB_TOKEN in .env.local.');
  }
  const drafts = await loadDrafts();
  const repo = 'salmansaymon57/ThemeFisher';
  const basePath = 'contents';
  try {
    await publishToGitHub(drafts, repo, basePath, token);
    await saveDrafts([]); // Clear drafts
    revalidatePath('/');
  } catch (error) {
    console.error('Publish error:', error);
    throw new Error(`Failed to publish: ${error.message}`);
  }
}
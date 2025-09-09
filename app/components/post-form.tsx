import React from 'react';
import { Draft, deleteDraft } from '../actions';
import DraftList from './DraftList';
import { redirect } from 'next/navigation';

interface PostFormProps {
  githubParams: { username: string; repo: string; token: string };
  editDraftId?: number;
  drafts: Draft[];
}

export async function triggerEditDraft(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  redirect(`/?editDraftId=${id}`);
}

export default function PostForm({ githubParams, editDraftId, drafts }: PostFormProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
      <form
        action={async (formData: FormData) => {
          'use server';
          await import('../actions').then(({ addDraft }) => addDraft(formData));
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={4}
            className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Add new draft"
        >
          Add Draft
        </button>
      </form>
      <DraftList
        drafts={drafts}
        editDraftId={editDraftId}
        onDelete={async (id: number) => {
          'use server';
          const formData = new FormData();
          formData.append('id', id.toString());
          await deleteDraft(formData);
        }}
        onEdit={async (id: number) => {
          'use server';
          const formData = new FormData();
          formData.append('id', id.toString());
          await triggerEditDraft(formData);
        }}
      />
      <form
        action={async (formData: FormData) => {
          'use server';
          await import('../actions').then(({ publishAll }) => publishAll(formData));
        }}
      >
        <button
          type="submit"
          disabled={drafts.length === 0}
          className="mt-8 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Publish all drafts"
        >
          Publish All
        </button>
      </form>
    </div>
  );
}
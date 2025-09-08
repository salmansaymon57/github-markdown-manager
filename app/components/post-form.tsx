// post-form.tsx
import React from 'react';
import DraftList from './DraftList';
import { addDraft, deleteDraft, editDraft, publishAll, loadDrafts } from '../actions';

interface GithubParams {
  username: string;
  repo: string;
  token: string;
}

interface PostFormProps {
  githubParams: GithubParams;
  editDraftId?: number;
}

export default async function PostForm({ githubParams, editDraftId }: PostFormProps) {
  const drafts = await loadDrafts();

  return (
    <div className="relative">
      <div className="max-w-2xl mt-5 mr-7 min-h-[600px] max-h-[80vh] p-4 bg-clip-padding border-gray-200 bg-white/30 shadow-md rounded-lg" role="region" aria-label="Post Creation and Management">
        <h2 className="text-lg text-center font-semibold mb-4">Create New Markdowns</h2>
        <form action={addDraft} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue=""
              className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              id="body"
              name="body"
              defaultValue=""
              className="mt-1 resize-none block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
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
        <DraftList drafts={drafts} onDelete={deleteDraft} onEdit={editDraft} editDraftId={editDraftId} />
        <form
  action={async (formData: FormData) => {
    'use server';
    await publishAll(formData); // No need to append githubParams; loaded from Redis
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
    </div>
  );
}
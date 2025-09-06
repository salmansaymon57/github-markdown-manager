import React from 'react';
import DraftList from './DraftList';
import { addDraft, deleteDraft, editDraft, publishAll, loadDrafts } from '../actions';

export default async function PostForm() {
  const drafts = await loadDrafts(); // Load persistent drafts

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg" role="region" aria-label="Post Creation and Management">
      <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
      <form action={addDraft} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue=""
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

      <DraftList drafts={drafts} onDelete={deleteDraft} onEdit={editDraft} />

      <form action={publishAll}>
        <button
          type="submit"
          disabled={drafts.length === 0}
          className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Publish all drafts"
        >
          Publish All
        </button>
      </form>
    </div>
  );
}
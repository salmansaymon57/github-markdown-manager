"use client"

import React, { useState } from 'react';
import DraftList from './DraftList';
import { sanitizeInput, publishToGitHub } from '@/utils'; // New utility functions

interface Draft {
  id: number;
  title: string;
  body: string;
}

// Component to manage posts with sanitized inputs and accessibility
const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedBody = sanitizeInput(body);
    if (sanitizedTitle && sanitizedBody) {
      setDrafts([...drafts, { id: Date.now(), title: sanitizedTitle, body: sanitizedBody }]);
      setTitle('');
      setBody('');
    }
  };

  const handleDelete = (id: number) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  const handleEdit = (id: number, updatedDraft: Draft) => {
    const sanitizedTitle = sanitizeInput(updatedDraft.title);
    const sanitizedBody = sanitizeInput(updatedDraft.body);
    setDrafts(drafts.map(draft => draft.id === id ? { ...draft, title: sanitizedTitle, body: sanitizedBody } : draft));
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    setError(null);
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      setError('GitHub token is missing.');
      setIsPublishing(false);
      return;
    }

    const repo = 'salmansaymon57/ThemeFisher';
    const basePath = 'contents';

    try {
      await publishToGitHub(drafts, repo, basePath, token);
      setDrafts([]);
    } catch (err) {
      setError(`Failed to publish: ${err.message}`);
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg" role="region" aria-label="Post Creation and Management">
      <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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

      <DraftList drafts={drafts} onDelete={handleDelete} onEdit={handleEdit} />

      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handlePublishAll}
        disabled={isPublishing || drafts.length === 0}
        className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Publish all drafts"
      >
        {isPublishing ? 'Publishing...' : 'Publish All'}
      </button>
    </div>
  );
};

export default PostForm;
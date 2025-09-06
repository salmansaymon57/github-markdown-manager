import React, { useState } from 'react';
import DraftList from './DraftList';

interface Draft {
  id: number;
  title: string;
  body: string;
}

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && body) {
      setDrafts([...drafts, { id: Date.now(), title, body }]);
      setTitle('');
      setBody('');
    }
  };

  const handleDelete = (id: number) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  const handleEdit = (id: number, updatedDraft: Draft) => {
    setDrafts(drafts.map(draft => draft.id === id ? updatedDraft : draft));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
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
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Draft
        </button>
      </form>

      <DraftList drafts={drafts} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default PostForm;
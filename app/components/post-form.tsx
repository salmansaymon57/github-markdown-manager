import React, { useState } from 'react';

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

      <h2 className="text-lg font-semibold mt-6 mb-4">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-2">
          {drafts.map((draft) => (
            <li key={draft.id} className="p-2 border rounded-md">
              <h3 className="font-medium">{draft.title}</h3>
              <p className="text-sm text-gray-600">{draft.body}</p>
              <button
                onClick={() => handleDelete(draft.id)}
                className="mt-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostForm;
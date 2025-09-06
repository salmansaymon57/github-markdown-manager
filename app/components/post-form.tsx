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
  const [isPublishing, setIsPublishing] = useState(false);

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

  const handlePublishAll = async () => {
    setIsPublishing(true);
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      alert('GitHub token is missing.');
      setIsPublishing(false);
      return;
    }

    const repo = 'salmansaymon57/ThemeFisher';
    const basePath = 'contents';

    for (const draft of drafts) {
      const filePath = `${basePath}/${draft.title.replace(/ /g, '-')}.md`;
      const content = draft.body;

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}/${filePath}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
          },
          body: JSON.stringify({
            message: `Add ${draft.title}`,
            content: btoa(content),
            branch: 'main', //Repository's branch
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to publish: ${response.status} - ${errorText}`);
        }
        console.log(`Published ${draft.title}`);
      } catch (error) {
        console.error(`Error publishing ${draft.title}:`, error);
        alert(`Failed to publish ${draft.title}.`);
      }
    }

    setDrafts([]);
    setIsPublishing(false);
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

      <button
        onClick={handlePublishAll}
        disabled={isPublishing || drafts.length === 0}
        className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPublishing ? 'Publishing...' : 'Publish All'}
      </button>
    </div>
  );
};

export default PostForm;
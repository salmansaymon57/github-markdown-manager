import React from 'react';

interface Draft {
  id: number;
  title: string;
  body: string;
}

interface DraftListProps {
  drafts: Draft[];
  onDelete: (formData: FormData) => Promise<void>;
  onEdit: (formData: FormData) => Promise<void>;
}

const DraftList: React.FC<DraftListProps> = ({ drafts, onDelete, onEdit }) => {
  return (
    <div className="mt-6" role="list" aria-label="List of drafts">
      <h2 className="text-lg font-semibold mb-4">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="p-4 border rounded-lg bg-white shadow-sm" role="listitem">
              <div>
                <h3 className="font-medium text-gray-900">{draft.title}</h3>
                <p className="text-sm text-gray-600">{draft.body}</p>
                <div className="mt-2 space-x-2">
                  <form action={onEdit} className="inline-block">
                    <input type="hidden" name="id" value={draft.id} />
                    <input
                      type="text"
                      name="title"
                      defaultValue={draft.title}
                      className="p-1 border rounded mr-1"
                      aria-label={`Edit title for ${draft.title}`}
                    />
                    <textarea
                      name="body"
                      defaultValue={draft.body}
                      className="p-1 border rounded mr-1"
                      rows={2}
                      aria-label={`Edit body for ${draft.title}`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      aria-label={`Save edits for ${draft.title}`}
                    >
                      Save Edit
                    </button>
                  </form>
                  <form action={onDelete} className="inline-block">
                    <input type="hidden" name="id" value={draft.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      aria-label={`Delete ${draft.title}`}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftList;
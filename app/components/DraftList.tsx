import React from 'react';

interface Draft {
  id: number;
  title: string;
  body: string;
}

interface DraftListProps {
  drafts: Draft[];
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedDraft: Draft) => void;
}

const DraftList: React.FC<DraftListProps> = ({ drafts, onDelete, onEdit }) => {
  const [editId, setEditId] = React.useState<number | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editBody, setEditBody] = React.useState('');

  const handleEdit = (draft: Draft) => {
    setEditId(draft.id);
    setEditTitle(draft.title);
    setEditBody(draft.body);
  };

  const handleSave = (id: number) => {
    onEdit(id, { id, title: editTitle, body: editBody });
    setEditId(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="p-4 border rounded-lg bg-white shadow-sm">
              {editId === draft.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <button
                    onClick={() => handleSave(draft.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-gray-900">{draft.title}</h3>
                  <p className="text-sm text-gray-600">{draft.body}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(draft)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(draft.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftList;
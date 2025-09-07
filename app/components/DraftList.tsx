"use client"

import React, { useState } from 'react';

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
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: number]: { title: string; body: string } }>({});

  const handleEditToggle = (id: number, draft: Draft) => {
    if (!editMode[id]) {
      setEditValues((prev) => ({ ...prev, [id]: { title: draft.title, body: draft.body } }));
    }
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (id: number, field: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    const formData = new FormData();
    formData.set('id', id.toString());
    formData.set('title', editValues[id].title);
    formData.set('body', editValues[id].body);
    await onEdit(formData);
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="mt-6" role="list" aria-label="List of drafts">
      <h2 className="text-lg font-semibold mb-4 text-indigo-800">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow" role="listitem">
              <div>
                {editMode[draft.id] ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValues[draft.id]?.title || draft.title}
                      onChange={(e) => handleChange(draft.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Edit title for ${draft.title}`}
                    />
                    <textarea
                      value={editValues[draft.id]?.body || draft.body}
                      onChange={(e) => handleChange(draft.id, 'body', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      aria-label={`Edit body for ${draft.title}`}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">{draft.title}</h3>
                    <p className="text-sm text-gray-600">{draft.body}</p>
                  </div>
                )}
                <div className="mt-2 space-x-2">
                  {editMode[draft.id] ? (
                    <button
                      onClick={() => handleSave(draft.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      aria-label={`Save edits for ${draft.title}`}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditToggle(draft.id, draft)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      aria-label={`Edit ${draft.title}`}
                    >
                      Edit
                    </button>
                  )}
                  <form action={onDelete} className="inline-block">
                    <input type="hidden" name="id" value={draft.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
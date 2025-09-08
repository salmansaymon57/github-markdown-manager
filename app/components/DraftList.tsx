"use client";

import React, { useState } from 'react';
import EditModal from './EditModal';

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
  const [selectedDraft, setSelectedDraft] = useState<{ id: number; title: string; body: string } | null>(null);

  const handleEditToggle = (id: number, draft: Draft) => {
    setSelectedDraft(draft); // Open modal with the selected draft
  };

  const handleChange = (id: number, field: string, value: string) => {
    if (selectedDraft && selectedDraft.id === id) {
      setEditValues((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    }
  };

  const handleSave = async (id: number, title: string, body: string) => {
    const formData = new FormData();
    formData.set('id', id.toString());
    formData.set('title', title);
    formData.set('body', body);
    await onEdit(formData);
    setSelectedDraft(null); // Close modal after save
  };

  const handleCloseModal = () => {
    setSelectedDraft(null);
  };

  return (
    <div className="mt-6" role="list" aria-label="List of drafts">
      <h2 className="text-lg font-semibold mb-4 text-indigo-800">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-4 flex flex-row custom-scrollbar overflow-x-auto gap-2">
          {drafts.map((draft) => (
            <li key={draft.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md hover:bg-amber-100 transition-shadow" role="listitem">
              <div className="w-32 h-25">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">{draft.title}</h3>
                  <p className="text-sm text-gray-600">{draft.body}</p>
                </div>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEditToggle(draft.id, draft)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    aria-label={`Edit ${draft.title}`}
                  >
                    Edit
                  </button>
                  <form action={onDelete} className="inline-block">
                    <input type="hidden" name="id" value={draft.id} />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
      <EditModal
        isOpen={!!selectedDraft}
        onClose={handleCloseModal}
        onSave={handleSave}
        draft={selectedDraft}
      />
    </div>
  );
};

export default DraftList;
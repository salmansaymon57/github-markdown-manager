"use client";

import React, { useState, useEffect } from 'react';
import { loadDrafts } from '../actions';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, title: string, body: string) => Promise<void>;
  draft: { id: number; title: string; body: string } | null;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, draft }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const fetchDraftData = async () => {
      if (isOpen && draft) {
        const drafts = await loadDrafts();
        const currentDraft = drafts.find(d => d.id === draft.id);
        if (currentDraft) {
          setTitle(currentDraft.title);
          setBody(currentDraft.body);
        }
      }
    };
    fetchDraftData();
  }, [isOpen, draft]);

  if (!isOpen || !draft) return null;

  const handleSave = async () => {
    await onSave(draft.id, title, body);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Edit Draft</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Title"
            aria-label="Edit draft title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Body"
            aria-label="Edit draft body"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              aria-label="Save edited draft"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
"use client";
import React from 'react';
import { Draft } from '../actions';

export interface DraftListProps {
  drafts: Draft[];
  editDraftId?: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function DraftList({ drafts, editDraftId, onDelete, onEdit }: DraftListProps) {
  return (
    <div className="mt-4 ">
      <h3 className="text-lg font-semibold mb-2">Drafts</h3>
      {drafts.length === 0 ? (
        <p>No drafts available.</p>
      ) : (
        <ul className="overflow-y-auto max-h-[150px] custom-scrollbar space-y-2">
          {drafts.map(draft => (
            <li key={draft.id} className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
              <div>
                <h4 className="font-medium">{draft.title}</h4>
                <p className="text-sm text-gray-600">{draft.body.substring(0, 50)}...</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(draft.id)}
                  className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={editDraftId === draft.id}
                  aria-label={`Edit draft ${draft.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(draft.id)}
                  className="py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
                  aria-label={`Delete draft ${draft.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
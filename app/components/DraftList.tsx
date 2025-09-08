// DraftList.tsx
import React from 'react';
import { Draft } from '../actions';

interface DraftListProps {
  drafts: Draft[];
  onDelete: (formData: FormData) => Promise<void>;
  onEdit: (formData: FormData) => Promise<void>;
  editDraftId?: number; // Optional prop to indicate which draft is being edited
}

const DraftList: React.FC<DraftListProps> = ({ drafts, onDelete, onEdit, editDraftId }) => {
  return (
    <div className="mt-6" role="list" aria-label="List of drafts">
      <h2 className="text-lg font-semibold mb-4 text-indigo-800">Drafts</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500 text-center">No drafts available.</p>
      ) : (
        <ul className="space-y-4 flex flex-row custom-scrollbar overflow-x-auto gap-2">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className="p-4 border h-30 rounded-lg bg-gray-50 shadow-sm hover:shadow-md hover:bg-amber-100 transition-shadow"
              role="listitem"
            >
              <div className="w-32 h-25">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">{draft.title}</h3>
                  <p className="text-sm text-gray-600">{draft.body}</p>
                </div>
                <div className="mt-2 space-x-2">
                  <form action="/?editDraftId" method="GET" className="inline-block">
                    <input type="hidden" name="editDraftId" value={draft.id} />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      aria-label={`Edit ${draft.title}`}
                    >
                      Edit
                    </button>
                  </form>
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
    </div>
  );
};

export default DraftList;
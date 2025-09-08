// EditModal.tsx
import React from 'react';
import { Draft, cancelEdit, editDraft } from '../actions';

interface EditModalProps {
  draft: Draft | null;
}

const EditModal: React.FC<EditModalProps> = ({ draft }) => {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Draft</h3>
        <form
          action={async (formData: FormData) => {
            'use server';
            const action = formData.get('action');
            if (action === 'cancel') {
              await cancelEdit();
            } else {
              await editDraft(formData);
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={draft.id} />
          <div>
            <input
              type="text"
              name="title"
              defaultValue={draft.title}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Title"
              aria-label="Edit draft title"
              required
            />
          </div>
          <div>
            <textarea
              name="body"
              defaultValue={draft.body}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Body"
              aria-label="Edit draft body"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              name="action"
              value="cancel"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
            <button
              type="submit"
              name="action"
              value="save"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              aria-label="Save edited draft"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
import React from 'react';
import { X } from 'lucide-react';

const IdeaDetailModal = ({ idea, onClose }) => {
  if (!idea) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{idea.description}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong className="text-[#7C3AED]">Equity:</strong> {idea.equity}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="text-[#7C3AED]">Salary:</strong> {idea.salary}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="text-[#7C3AED]">Founder:</strong> {idea.founderName}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="text-[#7C3AED]">Domain:</strong> {idea.domain}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <strong className="text-[#7C3AED]">Partnership Terms:</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">{idea.partnershipTerms}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailModal;
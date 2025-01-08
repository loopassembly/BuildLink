import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const CreateIdea = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Equity: '',
    Salary: '',
    PartnershipTerms: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/founder/create-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          navigate('/founder/dashboard');
        }, 2000);
      } else {
        console.error('Failed to create idea');
      }
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Idea</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
          <div>
            <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
              Idea Title
            </label>
            <input
              type="text"
              name="Title"
              id="Title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.Title}
              onChange={handleChange}
              placeholder="Enter a catchy title for your idea"
            />
          </div>
          <div>
            <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="Description"
              id="Description"
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Describe your idea in detail"
            ></textarea>
          </div>
          <div>
            <label htmlFor="Equity" className="block text-sm font-medium text-gray-700">
              Offered Equity
            </label>
            <input
              type="text"
              name="Equity"
              id="Equity"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.Equity}
              onChange={handleChange}
              placeholder="e.g., 10% equity"
            />
          </div>
          <div>
            <label htmlFor="Salary" className="block text-sm font-medium text-gray-700">
              Salary (Optional)
            </label>
            <input
              type="text"
              name="Salary"
              id="Salary"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.Salary}
              onChange={handleChange}
              placeholder="e.g., $80,000 per year"
            />
          </div>
          <div>
            <label htmlFor="PartnershipTerms" className="block text-sm font-medium text-gray-700">
              Partnership Terms
            </label>
            <textarea
              name="PartnershipTerms"
              id="PartnershipTerms"
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.PartnershipTerms}
              onChange={handleChange}
              placeholder="Outline the terms of the partnership"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]"
            >
              Submit Idea
            </button>
          </div>
        </form>
        {showToast && (
          <Toast
            message="Idea created successfully!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateIdea;
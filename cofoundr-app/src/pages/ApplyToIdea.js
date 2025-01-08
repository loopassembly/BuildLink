import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ApplyToIdea = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [formData, setFormData] = useState({
    Pitch: '',
    GitHubProfile: '',
    WhatsAppNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`http://localhost:3000/developer/dashboard`, {
          credentials: 'include',
        });
        if (response.ok) {
          const ideas = await response.json();
          const selectedIdea = ideas.find(i => i.ID === parseInt(ideaId));
          setIdea(selectedIdea);
        } else {
          console.error('Failed to fetch idea');
        }
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/developer/apply/${ideaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        // Store the applied idea ID in local storage
        const appliedIdeas = JSON.parse(localStorage.getItem('appliedIdeas')) || [];
        if (!appliedIdeas.includes(ideaId)) {
          appliedIdeas.push(ideaId);
          localStorage.setItem('appliedIdeas', JSON.stringify(appliedIdeas));
        }

        setShowToast(true);
        setTimeout(() => {
          navigate('/developer/dashboard');
        }, 2000);
      } else {
        console.error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!idea) {
    return <div className="text-center text-gray-700">Idea not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Apply to: {idea.title}</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 bg-[#7C3AED]">
            <h3 className="text-lg font-semibold text-white">Idea Details</h3>
          </div>
          <div className="px-6 py-6">
            <dl className="space-y-4">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.description}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Equity</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.equity}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.salary}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Founder</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.founderName}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Domain</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.domain}</dd>
              </div>
            </dl>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Pitch" className="block text-sm font-medium text-gray-700">
              Your Pitch
            </label>
            <textarea
              id="Pitch"
              name="Pitch"
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.Pitch}
              onChange={handleChange}
              placeholder="Explain why you're the perfect fit for this idea..."
            ></textarea>
          </div>
          <div>
            <label htmlFor="GitHubProfile" className="block text-sm font-medium text-gray-700">
              GitHub Profile
            </label>
            <input
              type="url"
              name="GitHubProfile"
              id="GitHubProfile"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.GitHubProfile}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label htmlFor="WhatsAppNumber" className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="WhatsAppNumber"
              id="WhatsAppNumber"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              value={formData.WhatsAppNumber}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]"
            >
              Submit Application
            </button>
          </div>
        </form>
        {showToast && (
          <Toast
            message="Application submitted successfully!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ApplyToIdea;
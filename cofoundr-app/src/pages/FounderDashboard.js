import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Info } from 'lucide-react';
import IdeaDetailModal from '../components/IdeaDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';

const FounderDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3000/founder/dashboard', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIdeas(data);
        } else {
          console.error('Failed to fetch ideas');
        }
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
        <Link
          to="/founder/create-idea"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Idea
        </Link>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {ideas.map((idea) => (
            <li key={idea.ID}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{idea.Title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Info className="mr-2 h-5 w-5" />
                      Details
                    </button>
                    <Link
                      to={`/founder/applications/${idea.ID}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200"
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      View Applications
                    </Link>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{idea.Description}</p>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Equity: {idea.Equity}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Salary: {idea.Salary}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Partnership Terms: {idea.PartnershipTerms}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedIdea && (
        <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </div>
  );
};

export default FounderDashboard;
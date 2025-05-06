import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import IdeaDetailModal from '../components/IdeaDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';

const DeveloperDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedIdeas, setAppliedIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        // Fetch ideas from both endpoints
        const [developerResponse, founderResponse] = await Promise.all([
          fetch('http://localhost:3000/developer/dashboard', {
            credentials: 'include',
          }),
          fetch('http://localhost:3000/founder/dashboard', {
            credentials: 'include',
          })
        ]);

        if (developerResponse.ok && founderResponse.ok) {
          const developerData = await developerResponse.json();
          const founderData = await founderResponse.json();

          // Filter out duplicates by comparing IDs
          const founderIdeaIds = founderData.map(idea => idea.ID);
          const uniqueIdeas = developerData.filter(idea => !founderIdeaIds.includes(idea.ID));

          setIdeas(uniqueIdeas);
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

    // Fetch applied ideas from localStorage
    const appliedIdeasFromStorage = JSON.parse(localStorage.getItem('appliedIdeas')) || [];
    setAppliedIdeas(appliedIdeasFromStorage);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Ideas</h1>
        {ideas.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">No ideas available</h3>
            <p className="mt-2 text-sm text-gray-600">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {ideas.map((idea) => (
                <li key={idea.ID} className="hover:bg-gray-50 transition duration-200">
                  <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{idea.Title}</h3>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setSelectedIdea(idea)}
                          className="inline-flex items-center px-4 py-2 border border-[#7C3AED] text-sm font-medium rounded-md text-[#7C3AED] bg-transparent hover:bg-[#7C3AED]/10 transition duration-300"
                        >
                          <Info className="mr-2 h-5 w-5" />
                          Details
                        </button>
                        {!appliedIdeas.includes(idea.ID.toString()) && (
                          <Link
                            to={`/developer/apply/${idea.ID}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition duration-300"
                          >
                            Apply
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{idea.Description}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Equity:</span> {idea.Equity}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Salary:</span> {idea.Salary}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Partnership Terms:</span> {idea.PartnershipTerms}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedIdea && (
          <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
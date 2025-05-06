import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const ViewApplications = () => {
  const { ideaId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [acceptedApplicationId, setAcceptedApplicationId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:3000/founder/applications/${ideaId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [ideaId]);

  const handleAccept = async (applicationId) => {
    try {
      const response = await fetch(`http://localhost:3000/founder/applications/${ideaId}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setShowToast(true);
        setAcceptedApplicationId(applicationId);
      } else {
        console.error('Failed to accept application');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Applications for Idea #{ideaId}</h1>
        {applications.length === 0 ? (
          <p className="text-gray-600">No applications yet for this idea.</p>
        ) : (
          <ul className="space-y-6">
            {applications.map((application) => (
              <li key={application.ID} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-6">
                  <h3 className="text-xl font-semibold text-gray-900">{application.DeveloperName}</h3>
                  <div className="mt-1 flex items-center space-x-4">
                    <a
                      href={application.GitHubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7C3AED] hover:text-[#6D28D9] transition duration-300"
                    >
                      GitHub Profile
                    </a>
                    {acceptedApplicationId === application.ID && (
                      <div className="flex items-center space-x-2">
                        {application.WhatsAppNumber ? (
                          <>
                            <span className="text-sm text-gray-600">{application.WhatsAppNumber}</span>
                            <a
                              href={`https://wa.me/${application.WhatsAppNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition duration-300"
                            >
                              <span className="mr-1">📱</span> Chat on WhatsApp
                            </a>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">No number available</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-6">
                  <p className="text-sm text-gray-700">{application.Pitch}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleAccept(application.ID)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7C3AED] hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] transition duration-300"
                    >
                      Accept Application  
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {showToast && (
          <Toast
            message="WhatsApp numbers shared!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
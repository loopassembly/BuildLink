import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const cookies = document.cookie.split(';');
    const loggedIn = cookies.some(cookie => cookie.trim().startsWith('some_random_secret='));
    setIsLoggedIn(loggedIn);
  };

  const handleLogin = (role) => {
    // Include the role in the GitHub auth URL
    window.location.href = `http://localhost:3000/auth/github?role=${role}`;
  };

  const handleFounderClick = () => {
    if (isLoggedIn) {
      navigate('/founder/dashboard');
    } else {
      handleLogin('founder');
    }
  };

  const handleDeveloperClick = () => {
    if (isLoggedIn) {
      navigate('/developer/dashboard');
    } else {
      handleLogin('developer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
            Find Your Perfect <span className="text-[#7C3AED]">Co-Founder</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-600">
            Connect with talented developers or visionary founders to build the next big thing together.
          </p>
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={handleFounderClick}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition duration-300 shadow-lg hover:shadow-[#7C3AED]/50"
            >
              I am a Founder
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            <button
              onClick={handleDeveloperClick}
              className="inline-flex items-center px-8 py-4 border border-[#7C3AED] text-lg font-semibold rounded-lg text-[#7C3AED] bg-white hover:bg-[#F5F3FF] transition duration-300 shadow-md hover:shadow-[#7C3AED]/30"
            >
              I am a Developer
              <Github className="ml-3 h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
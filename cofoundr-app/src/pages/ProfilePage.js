import React from 'react';
import { useParams } from 'react-router-dom';

const dummyProfiles = {
  founder: {
    name: "Dr. Sarah Chen",
    role: "Founder",
    bio: "Experienced healthcare professional with a passion for AI and machine learning.",
    skills: ["Healthcare", "AI", "Project Management"],
    education: "Ph.D. in Computer Science, Stanford University",
    experience: "10+ years in healthcare technology"
  },
  developer: {
    name: "Alex Johnson",
    role: "Developer",
    bio: "Full-stack developer with a focus on building scalable web applications.",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    education: "B.S. in Computer Science, MIT",
    experience: "5 years of professional software development"
  }
};

const ProfilePage = () => {
  const { role } = useParams();
  const profile = dummyProfiles[role];

  if (!profile) return <div className="text-center text-gray-700">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-6 bg-[#7C3AED]">
            <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
            <p className="mt-1 text-sm text-[#EDE9FE]">{profile.role}</p>
          </div>
          <div className="px-6 py-6">
            <dl className="space-y-6">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-700">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.bio}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-700">Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.skills.join(", ")}
                </dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-700">Education</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.education}</dd>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-700">Experience</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.experience}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
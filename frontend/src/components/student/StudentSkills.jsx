import React from 'react';
import { CodeBracketIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

const StudentSkills = ({ skills }) => {
  const colors = [
    { bg: 'from-blue-500 to-blue-600', border: 'border-blue-200', text: 'text-white' },
    { bg: 'from-purple-500 to-purple-600', border: 'border-purple-200', text: 'text-white' },
    { bg: 'from-emerald-500 to-emerald-600', border: 'border-emerald-200', text: 'text-white' },
    { bg: 'from-orange-500 to-orange-600', border: 'border-orange-200', text: 'text-white' },
    { bg: 'from-pink-500 to-pink-600', border: 'border-pink-200', text: 'text-white' },
    { bg: 'from-cyan-500 to-cyan-600', border: 'border-cyan-200', text: 'text-white' },
    { bg: 'from-indigo-500 to-indigo-600', border: 'border-indigo-200', text: 'text-white' },
    { bg: 'from-rose-500 to-rose-600', border: 'border-rose-200', text: 'text-white' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <CodeBracketIcon className="w-5 h-5 text-[#5B82C5]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Technical Skills</h3>
            <p className="text-xs font-semibold text-gray-500">Your technical expertise and proficiency</p>
          </div>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
          <PlusIcon className="w-4 h-4" /> Add Skill
        </button>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => {
            const color = colors[index % colors.length];
            return (
              <div key={skill.id || index} className={`group relative`}>
                <div className={`bg-gradient-to-r ${color.bg} px-4 py-2 rounded-xl text-sm font-bold ${color.text} shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2`}>
                  <SparklesIcon className="w-4 h-4" />
                  {skill.skill_name || skill}
                </div>
                {skill.proficiency_level && (
                  <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                    skill.proficiency_level === 'Expert' || skill.proficiency_level === 'Advanced' ? 'bg-emerald-500 text-white border-emerald-300' :
                    skill.proficiency_level === 'Intermediate' ? 'bg-amber-500 text-white border-amber-300' :
                    'bg-blue-500 text-white border-blue-300'
                  }`}>
                    {skill.proficiency_level}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <CodeBracketIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No skills added yet</p>
          <button className="mt-4 px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 mx-auto">
            <PlusIcon className="w-4 h-4" /> Add Your First Skill
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSkills;

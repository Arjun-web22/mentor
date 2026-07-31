import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CollegeContext = createContext(undefined);

export const CollegeProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load college from localStorage, URL, or user's college_id on mount
  useEffect(() => {
    const loadCollege = () => {
      try {
        // Priority 1: URL params
        const urlParams = new URLSearchParams(window.location.search);
        const urlCollegeId = urlParams.get('collegeId');
        
        if (urlCollegeId) {
          const collegeId = parseInt(urlCollegeId);
          setSelectedCollege(collegeId);
          localStorage.setItem('selectedCollegeId', collegeId.toString());
        } 
        // Priority 2: localStorage
        else if (localStorage.getItem('selectedCollegeId')) {
          const storedCollegeId = parseInt(localStorage.getItem('selectedCollegeId'));
          setSelectedCollege(storedCollegeId);
        }
        // Priority 3: User's college_id from JWT
        else if (user?.college_id) {
          const userCollegeId = parseInt(user.college_id);
          setSelectedCollege(userCollegeId);
          localStorage.setItem('selectedCollegeId', userCollegeId.toString());
        }
        // Priority 4: Fallback to 1 (FXEC)
        else {
          setSelectedCollege(1);
          localStorage.setItem('selectedCollegeId', '1');
        }
      } catch (error) {
        console.error('Error loading college:', error);
        // Fallback to 1 on error
        setSelectedCollege(1);
        localStorage.setItem('selectedCollegeId', '1');
      } finally {
        setLoading(false);
      }
    };

    loadCollege();
  }, [user?.college_id]);

  const setCollege = (collegeId) => {
    setSelectedCollege(collegeId);
    localStorage.setItem('selectedCollegeId', collegeId.toString());
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (collegeId) {
      url.searchParams.set('collegeId', collegeId);
    } else {
      url.searchParams.delete('collegeId');
    }
    window.history.replaceState({}, '', url);
  };

  return (
    <CollegeContext.Provider
      value={{
        selectedCollege,
        setCollege,
        loading
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};

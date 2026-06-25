import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export const handleBackNavigation = (navigate, location) => {
  if (location.pathname === '/home' || location.pathname === '/login') {
    CapacitorApp.exitApp();
  } else {
    // If we have history, navigate back
    if (window.history.length > 2 || (window.history.state && window.history.state.idx > 0)) {
      navigate(-1);
    } else {
      // Otherwise, fallback to home safely
      navigate('/home', { replace: true });
    }
  }
};

const AppBackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let backButtonListener;
    const setupListener = async () => {
      try {
        backButtonListener = await CapacitorApp.addListener('backButton', () => {
          handleBackNavigation(navigate, location);
        });
      } catch (err) {
        console.warn('Capacitor App plugin not available', err);
      }
    };
    setupListener();
    
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [location, navigate]);

  return null;
};

export default AppBackHandler;

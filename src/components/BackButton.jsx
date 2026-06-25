import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { handleBackNavigation } from './AppBackHandler';

const BackButton = ({ className, children, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    handleBackNavigation(navigate, location);
  };

  if (location.pathname === '/home' || location.pathname === '/login') {
    return null;
  }

  return (
    <button onClick={onClick} className={className} {...props}>
      {children || <ChevronLeft size={24} />}
    </button>
  );
};

export default BackButton;

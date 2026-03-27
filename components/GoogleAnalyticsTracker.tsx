import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-TFQW3PX8NP', {
        page_path: location.pathname + location.search + location.hash
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalyticsTracker;

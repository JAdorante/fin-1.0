import React, { useState, useEffect } from 'react';
import { getSecurityData } from '../../services/securityService';
import Disclaimer from './Disclaimer';
import Loading from './Loading';

const SecurityCard = ({ ticker }) => {
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      if (!ticker) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getSecurityData(ticker);
        setSecurity(data);
      } catch (err) {
        console.error('Error fetching security data:', err);
        setError(`Failed to fetch data for ${ticker}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, [ticker]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!security) {
    return <div>No data available for {ticker}</div>;
  }

  const { price, dailyChange, description } = security;
  const isPositive = dailyChange >= 0;

  return (
    <div className="security-card">
      <div className="security-header">
        <h2>{ticker}</h2>
        <div className="security-price">${price.toFixed(2)}</div>
        <div className={`daily-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{dailyChange.toFixed(2)}%
        </div>
      </div>
      
      <div className="security-description">
        <p>{description}</p>
      </div>
      
      <Disclaimer />
    </div>
  );
};

export default SecurityCard;
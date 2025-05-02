import React, { useState, useEffect } from 'react';
import { getMarketSummary } from '../../services/marketService';
import NewsHeadlines from './NewsHeadlines';
import Loading from '../common/Loading';
import Disclaimer from '../common/Disclaimer';

const MarketSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMarketSummary();
        setSummary(data);
      } catch (err) {
        console.error('Error fetching market summary:', err);
        setError('Failed to fetch market summary');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketSummary();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!summary) {
    return <div>No market data available</div>;
  }

  const { indices, sentiment } = summary;

  return (
    <div className="market-summary">
      <h2>Market Summary</h2>
      
      <div className="indices-container">
        {indices.map((index) => (
          <div key={index.name} className="index-card">
            <h3>{index.name}</h3>
            <div className="index-value">{index.value.toLocaleString()}</div>
            <div className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="market-sentiment">
        <h3>Market Sentiment</h3>
        <div className={`sentiment-indicator ${sentiment.toLowerCase()}`}>
          {sentiment}
        </div>
      </div>
      
      <NewsHeadlines headlines={summary.headlines} />
      
      <Disclaimer />
    </div>
  );
};

export default MarketSummary;
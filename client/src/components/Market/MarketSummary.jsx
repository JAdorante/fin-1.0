import React, { useState, useEffect } from 'react';
import { getMarketSummary } from '../../services/marketService';
import NewsHeadlines from './NewsHeadlines';
import Loading from '/common/Loading';
import Disclaimer from '/common/Disclaimer';

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
        setError('Failed to fetch market data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchMarketSummary();

    // Set up refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchMarketSummary, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !summary) {
    return <Loading />;
  }

  if (error && !summary) {
    return <div className="error-message">{error}</div>;
  }

  if (!summary) {
    return <div>No market data available</div>;
  }

  const { indices, sentiment, asOf } = summary;
  
  // Format the last updated time
  const lastUpdated = new Date(asOf).toLocaleTimeString();

  return (
    <div className="market-summary">
      <h2>Market Summary</h2>
      
      <div className="indices-container">
        {indices.map((index) => (
          <div key={index.symbol} className="index-card">
            <h3>{index.name}</h3>
            <div className="index-value">{index.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</div>
            <div className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="market-sentiment">
        <h3>Market Sentiment</h3>
        <div className={`sentiment-indicator ${sentiment.toLowerCase().replace(' ', '-')}`}>
          {sentiment}
        </div>
      </div>
      
      <NewsHeadlines headlines={summary.headlines} />
      
      <div className="data-timestamp">
        Last updated: {lastUpdated}
      </div>
      
      <div className="data-source">
        <small>Data provided by Alpaca Markets</small>
      </div>
      
      <Disclaimer />
    </div>
  );
};

export default MarketSummary;
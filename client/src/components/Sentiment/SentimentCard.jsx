import React from 'react';
import Disclaimer from '/common/Disclaimer';

const SentimentCard = ({ sentiment }) => {
  if (!sentiment) {
    return <p>No sentiment data available</p>;
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'positive';
      case 'negative':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="sentiment-card">
      <h2>Sentiment Overview: {sentiment.ticker}</h2>
      
      <div className={`sentiment-label ${getSentimentColor(sentiment.value)}`}>
        {sentiment.value}
      </div>
      
      {sentiment.factors && (
        <div className="sentiment-factors">
          <h3>Contributing Factors</h3>
          <ul>
            {sentiment.factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}
      
      <Disclaimer />
    </div>
  );
};

export default SentimentCard;
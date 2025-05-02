import React from 'react';
import Disclaimer from '../common/Disclaimer';

const StrategyCard = ({ strategy }) => {
  if (!strategy) {
    return <p>No strategy data available</p>;
  }

  return (
    <div className="strategy-card">
      <h2>Strategy Suggestion</h2>
      
      <div className="strategy-context">
        <p>{strategy.context}</p>
      </div>
      
      <div className="strategy-description">
        <h3>{strategy.name}</h3>
        <p>{strategy.description}</p>
      </div>
      
      {strategy.indicators && (
        <div className="strategy-indicators">
          <h3>Key Indicators</h3>
          <ul>
            {strategy.indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
      )}
      
      <Disclaimer />
    </div>
  );
};

export default StrategyCard;
import React from 'react';
import RiskReport from './RiskReport';
import Disclaimer from './Disclaimer';

const PortfolioSummary = ({ portfolio }) => {
  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return <p>No portfolio data available</p>;
  }

  const totalValue = portfolio.holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.averageCost,
    0
  );

  return (
    <div className="portfolio-summary">
      <h2>Portfolio Summary</h2>
      <div className="portfolio-table-container">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Shares</th>
              <th>Avg. Cost</th>
              <th>Value</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.map((holding) => {
              const value = holding.shares * holding.averageCost;
              const allocation = ((value / totalValue) * 100).toFixed(2);
              
              return (
                <tr key={holding.ticker}>
                  <td>{holding.ticker}</td>
                  <td>{holding.shares}</td>
                  <td>${holding.averageCost.toFixed(2)}</td>
                  <td>${value.toFixed(2)}</td>
                  <td>{allocation}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="portfolio-total">
        <p>Total Value: ${totalValue.toFixed(2)}</p>
      </div>
      
      <RiskReport portfolio={portfolio} />
      <Disclaimer />
    </div>
  );
};

export default PortfolioSummary;
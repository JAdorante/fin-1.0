import React from 'react';

const RiskReport = ({ portfolio }) => {
  // This is a mocked component for the MVP
  // In a real implementation, this would calculate actual risk metrics
  
  // Mock sector allocation data
  const sectorAllocation = {
    'Technology': 60,
    'Finance': 30,
    'Consumer': 10,
  };
  
  // Mock risk level
  const riskLevel = 'Moderate';
  
  return (
    <div className="risk-report">
      <h3>Portfolio Analysis</h3>
      
      <div className="sector-exposure">
        <h4>Sector Exposure</h4>
        <div className="sector-bars">
          {Object.entries(sectorAllocation).map(([sector, percentage]) => (
            <div key={sector} className="sector-bar-container">
              <div className="sector-label">{sector}</div>
              <div className="sector-bar-wrapper">
                <div 
                  className="sector-bar" 
                  style={{ width: `${percentage}%` }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="risk-assessment">
        <h4>Risk Assessment</h4>
        <p>Risk Level: <span className="risk-level">{riskLevel}</span></p>
        <p className="risk-description">
          This portfolio has a {riskLevel.toLowerCase()} risk profile based on asset allocation and sector diversification.
        </p>
      </div>
    </div>
  );
};

export default RiskReport;
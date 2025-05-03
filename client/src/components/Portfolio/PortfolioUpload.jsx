import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadPortfolio } from '../../services/portfolioService';
import Disclaimer from './Disclaimer';

const PortfolioUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setError('Please upload a CSV file');
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await uploadPortfolio(user.uid, file);
      onUploadComplete(result);
    } catch (err) {
      console.error('Portfolio upload error:', err);
      setError('Failed to upload portfolio. Please ensure your CSV is formatted correctly (Ticker,Shares,AverageCost).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-upload">
      <h2>Upload Portfolio</h2>
      <p className="upload-instructions">
        Upload a CSV file with the following columns: Ticker, Shares, AverageCost
        <br />
        Example: TSLA,100,250.50
      </p>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <input
            type="file"
            id="portfolio-file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="portfolio-file" className="file-input-label">
            {file ? file.name : 'Choose CSV file'}
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!file || loading} className="analyze-button">
          {loading ? 'Analyzing...' : 'Analyze Portfolio'}
        </button>
      </form>
      <Disclaimer />
    </div>
  );
};

export default PortfolioUpload;
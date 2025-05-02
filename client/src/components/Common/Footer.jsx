import React from 'react';
import Disclaimer from './Disclaimer';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Disclaimer />
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Fin 1.0 - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
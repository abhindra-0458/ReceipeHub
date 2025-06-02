import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>RecipeHub</h3>
          <p>Your collaborative recipe platform</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Browse Recipes</Link></li>
            <li><Link to="/dashboard">My Recipes</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
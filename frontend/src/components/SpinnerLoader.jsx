import React from 'react';
import './SpinnerLoader.css';

export default function SpinnerLoader({ size = "2.8rem", color = "#183153" }) {
  return (
    <div className="spinner-loader-overlay" style={{ '--uib-size': size, '--uib-color': color }}>
      <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
      </div>
    </div>
  );
}

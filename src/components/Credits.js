import React from 'react';

const Credits = ({ show, credits }) => {
  if (!show) {
    return null;
  }
  let children
  if (credits) {
    children = credits.map((credit, index) => {
      if (credit.startsWith('link:')) {
        const url = credit.slice(5);
        return (
          <div key={index} className="credit"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></div>
        );
      } else if (credit === '') {
        return (
          <div key={index} className="credit"></div>
        );
      } else {
        return (
          <div key={index} className="credit">{credit}</div>
        );
      }
    });
  }
  return (
    <div id="credits">
      {children}
    </div>
  );
}

export default Credits;

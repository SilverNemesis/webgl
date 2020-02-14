import React from 'react';

const Credits = ({ show, credits }) => {
  if (!show) {
    return null;
  }
  let children
  if (credits) {
    children = credits.map((credit, index) => {
      return (
        <div key={index} className="credit">{credit}</div>
      );
    });
  }
  return (
    <div id="credits">
      <div>
        {children}
      </div>
    </div>
  );
}

export default Credits;

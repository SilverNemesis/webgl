import React from 'react';

const Controls = ({ show, children }) => {
  if (!show) {
    return null;
  }
  return (
    <div id="overlay">
      {children}
    </div>
  );
}

export default Controls;

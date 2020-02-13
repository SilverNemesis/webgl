import React from 'react';

const Message = ({ message }) => {
  if (!message) {
    return null;
  }
  return (
    <div id="message">
      {message.map((text, index) => (<div key={index}>{text}</div>))}
    </div>
  );
}

export default Message;

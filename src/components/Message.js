import React from 'react';

const Message = ({ message, onClick }) => {
  if (!message) {
    return null;
  }
  return (
    <div id="message" onClick={onClick}>
      {message.map((text, index) => (<div key={index}>{text}</div>))}
    </div>
  );
}

export default Message;

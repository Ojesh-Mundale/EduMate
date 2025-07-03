import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8080/api/chat', { message: input });
      const aiMessage = { sender: 'ai', text: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Error: Unable to get response from AI.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = async () => {
    try {
      await axios.post('http://localhost:8080/api/clearChat');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white flex flex-col h-96">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${msg.sender === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <textarea
        className="border rounded p-2 mb-2 resize-none"
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
      />
      <div className="flex space-x-2">
        <button
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex-1"
          onClick={sendMessage}
        >
          Send
        </button>
        <button
          className="bg-red-500 text-white py-2 rounded hover:bg-red-600 flex-1"
          onClick={clearChat}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

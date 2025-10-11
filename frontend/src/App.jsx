import { useState, useRef } from 'react'
import './App.css'

function App() {
  // State for chat messages: array of { role: 'user' | 'ai', text: string }
  const [messages, setMessages] = useState([]);
  // State for current input message
  const [inputMessage, setInputMessage] = useState('');
  // State for loading while waiting for AI response
  const [isLoading, setIsLoading] = useState(false);
  // Ref for input field to maintain focus
  const inputRef = useRef(null);

  // Function to send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Keep focus on input for next message
    inputRef.current?.focus();

    try {
      // Send POST request to backend /chat endpoint
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { role: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>AI Chat Agent</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  )
}

export default App

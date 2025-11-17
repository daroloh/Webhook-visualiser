import React, { useState } from 'react';
import axios from 'axios';
import './EndpointGenerator.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function EndpointGenerator({ onEndpointCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) {
      alert('Please enter an endpoint name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/endpoints`, {
        name: name.trim()
      });
      
      onEndpointCreated(response.data);
      setName('');
    } catch (error) {
      console.error('Error creating endpoint:', error);
      alert('Failed to create endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="endpoint-generator">
      <h3>Generate Webhook URL</h3>
      <input
        type="text"
        placeholder="Enter endpoint name (e.g., Stripe Webhooks)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Endpoint'}
      </button>
    </div>
  );
}

export default EndpointGenerator;

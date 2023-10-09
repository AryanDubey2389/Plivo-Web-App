import React, { useState } from 'react';
import './App.css';
import Weather from './weather';
import VoiceNote from './voiceNote';
import VoiceJoke from './voiceJoke';

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState('');

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  let componentToRender;
  if (selectedComponent) {
    switch (selectedComponent) {
      case 'Weather':
        componentToRender = <Weather />;
        break;
      case 'VoiceNote':
        componentToRender = <VoiceNote />;
        break;
      case 'VoiceJoke':
        componentToRender = <VoiceJoke />;
        break;
      default:
        componentToRender = null;
    }
  } else {
    componentToRender = null;
  }

  return (
    <div className="dropdown-container"> {/* Updated class name here */}
      <div className="dropdown-container">
        {selectedComponent === '' && (
          <label className="label">Enjoy by selecting any:</label>
        )}
        <div className="dropdown">
          <select
            value={selectedComponent}
            onChange={(e) => handleComponentChange(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Weather">Weather</option>
            <option value="VoiceNote">VoiceNote</option>
            <option value="VoiceJoke">VoiceJoke</option>
          </select>
        </div>
      </div>
      {componentToRender}
    </div>
  );
};

export default App;

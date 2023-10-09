import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BsMusicNoteList } from 'react-icons/bs';

const VoiceNote = () => {
  const [text, setText] = useState('');
  const [phoneNote, setPhoneNote] = useState('');
  const [textNote, setTextNote] = useState('');
  const apiKey = '82c3c4350273ec42bec2b45eb7ced77a';

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    console.log('text - ', textNote);
    console.log('text - ', phoneNote);

    try {
      const response = await axios.post('http://localhost:5000/voice-call-note', { textNote , phoneNote});

      console.log('Text submitted successfully:', response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error submitting text:', error);
    }
  };
  return (
    <div className="weather-form-container">
      <div className="title">
        <div className="centered">
          <BsMusicNoteList />
          <span className="separator"></span>
        </div>
        <div className="centered">Personalised Note Maker</div>
      </div>
      <h6 style={{ color: 'rgb(206, 206, 127)', fontSize: '16px', textAlign: 'center' }}>
        You can send voice notes here...
      </h6>
      <form onSubmit={handleSubmitNote} className="weather-form">
        <div>
          <label style={{ color: 'rgb(206, 206, 127)' }}>Personalised Note: </label>
          <input
            type="text"
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            required
          />
          <br />
          <label style={{ color: 'rgb(206, 206, 127)' }}>Phone Number:</label>
          <input
            type="text"
            value={phoneNote}
            onChange={(e) => setPhoneNote(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  
  );
};

export default VoiceNote;

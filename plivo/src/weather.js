import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { TiWeatherPartlySunny } from 'react-icons/ti';

// Import the fetchPlace function

const fetchPlace = async (text) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=pk.eyJ1IjoicGVlZWthYWNodSIsImEiOiJjbG5pNjZjanExZWY4MnNtamk4cnBydTRyIn0.uBSsf0tL09omZEF4NGB03g&cachebuster=1625641871908&autocomplete=true&types=place`
    );
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch (err) {
    return { error: 'Unable to retrieve places' };
  }
};

const Weather = () => {
  const [text, setText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState('');
  const [phoneNote, setPhoneNote] = useState('');
  const [textNote, setTextNote] = useState('');
  const apiKey = '82c3c4350273ec42bec2b45eb7ced77a';

  // Modify the handleCityChange function to use fetchPlace
  const handleCityChange = async (e) => {
    setCity(e.target.value);
    if (!e.target.value) return;

    const res = await fetchPlace(e.target.value);
    if (res.error) {
      setAutocompleteErr(res.error);
      setSuggestions([]);
    } else if (res.features) {
      const cities = res.features.map((place) => place.place_name);
      setSuggestions(cities);
      setAutocompleteErr('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const number = '+91' + phoneNumber;
    try {
      const weatherReport = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const response = await axios.post('http://localhost:5000/make-voice-call', { text, phoneNumber: number, weatherReport });
      console.log('Text submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting text:', error);
    }
  };

  useEffect(() => {
    if (!city) {
      setSuggestions([]);
    }
  }, [city]);

  return (
    <div className="weather-form-container">
      <div className="title">
        <div className="centered">
          <TiWeatherPartlySunny />
          <span className="separator"></span>
        </div>
        <div className="centered">Get Weather Info</div>
      </div>
      <h6 style={{ color: 'rgb(206, 206, 127)', fontSize: '16px', textAlign: 'center' }}>
        You can get temperature, wind, humidity, and more...
      </h6>
      <form onSubmit={handleSubmit} className="weather-form">
        <div>
          <label style={{ color: 'rgb(206, 206, 127)' }}>Name: </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="Enter your name here"
          />
          <br />
          <label style={{ color: 'rgb(206, 206, 127)' }}>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Enter your phone number here"
          />

          <label style={{ color: 'rgb(206, 206, 127)' }}>Check Weather of the given city:</label>
          <input
            list="places"
            type="text"
            id="city"
            name="city"
            onChange={handleCityChange}
            value={city}
            required
            autoComplete="off"
            placeholder="Enter Your City here"
          />
          <datalist id="places">
            {suggestions.map((suggestion, index) => (
              <option key={index}>{suggestion}</option>
            ))}
          </datalist>
          {autocompleteErr && (
            <span className="inputError">{autocompleteErr}</span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Weather;

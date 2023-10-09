const express = require('express');
const bodyParser = require('body-parser');
const plivo = require('plivo');
const axios = require('axios');
const cors = require('cors'); // Import the 'cors' middleware
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
  };
  
app.use(cors(corsOptions));

// Create a Plivo client instance
const authId = '';
const authToken = ''; 
const plivoClient = new plivo.Client(authId, authToken);
function parseWeatherInfo(weatherObj)
{
  retStr = `Temperature: ${(weatherObj['temp']-273.15).toFixed(2)} degree celsius,
            Feels like: ${(weatherObj['feels_like']-273.15).toFixed(2)} degree celsius,
            Minimum Temperature: ${(weatherObj['temp_min']-273.15).toFixed(2)} degree celsius,
            Maximum Temperature: ${(weatherObj['temp_max']-273.15).toFixed(2)} degree celsius,
            Pressure: ${(weatherObj['pressure']).toFixed(2)},
            Humidity: ${(weatherObj['humidity']).toFixed(2)}
  `;
  return retStr;
}
  app.get('/custom_message', (req, res) => {
    res.sendFile(__dirname + '/custom_message.xml');
  });

app.post('/make-voice-call', async (req, res) => {
    
  const { text, phoneNumber , weatherReport} = req.body;
  console.log('ret - ', req.body);
    const weatherObj = weatherReport['data']['main'];
    const weatherInfo = parseWeatherInfo(weatherObj);
    console.log("weather report = ",weatherReport['data']['main']['temp']);
    console.log('weater info - ', weatherInfo);
    const message_xml = 
    `<Response>
        <Speak>${'Hi ' + text + ' The weather info of ' + weatherReport['data']['name'] + ' currently is ' + weatherInfo}</Speak>
    </Response>`;

    fs.writeFile('custom_message.xml', message_xml, function (err) {
    if (err) return console.log(err);
    console.log('custom_message.xml saved');
    });

    plivoClient.calls.create(
      '+916204000406', // Replace with your Plivo source phone number
      phoneNumber,
      "https://fd25-2409-40f0-112d-822d-284f-a480-d2ee-9fb3.ngrok-free.app/custom_message",
      {
        answerMethod: 'GET',
      }
    )
      .then((response) => {
        console.log('Plivo voice call initiated:', response);
        res.status(200).json({ message: 'Voice call initiated' });
      })
      .catch((error) => {
        console.error('Error making Plivo voice call:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
});

app.post('/voice-call-note', async (req, res) => {
    
  const { textNote, phoneNote} = req.body; // Phone number to make the call to
    const message_xml = 
    `<Response>
        <Speak>${'Personalised note for you: '+ textNote}</Speak>
    </Response>`;

    // save message_xml in custom_message.xml file
    fs.writeFile('custom_message.xml', message_xml, function (err) {
    if (err) return console.log(err);
    console.log('custom_message.xml saved');
    });

    plivoClient.calls.create(
      '+916204000406', // Replace with your Plivo source phone number
      phoneNote,
      "https://fd25-2409-40f0-112d-822d-284f-a480-d2ee-9fb3.ngrok-free.app/custom_message",
      {
        answerMethod: 'GET',
      }
    )
      .then((response) => {
        console.log('Plivo voice call initiated:', response);
        res.status(200).json({ message: 'Voice call initiated' });
      })
      .catch((error) => {
        console.error('Error making Plivo voice call:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
});
app.post('/voice-call-joke', async (req, res) => {
    
  const {phoneNumberThree} = req.body; // Phone number to make the call to
    const jokeForToday = await axios.get(`https://v2.jokeapi.dev/joke/Programming?format=txt&type=single`);
    // console.log("joke for today = ",jokeForToday, " type = ",typeof(jokeForToday));
    const message_xml = 
    `<Response>
        <Speak>${'The joke for today is ' + jokeForToday['data']}</Speak>
    </Response>`;

    // save message_xml in custom_message.xml file
    fs.writeFile('custom_message.xml', message_xml, function (err) {
    if (err) return console.log(err);
    console.log('custom_message.xml saved');
    });

  try {
    // Create a Plivo call and play a recorded message
    const response = await plivoClient.calls.create(
      '+916204000406', // Replace with your Plivo source phone number
      phoneNumberThree,
      "https://fd25-2409-40f0-112d-822d-284f-a480-d2ee-9fb3.ngrok-free.app/custom_message",
      {
        answerMethod: 'GET',
      }
    );

    console.log('Plivo voice call initiated:', response);
    res.status(200).json({ message: 'Voice call initiated' });
  } catch (error) {
    console.error('Error making Plivo voice call:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

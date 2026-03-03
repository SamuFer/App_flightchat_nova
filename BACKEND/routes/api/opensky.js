const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/bcn', async (req, res) => {
  try {
    const response = await axios.get('https://opensky-network.org/api/states/all', {
      params: {
        lamin: 41.26,
        lamax: 41.33,
        lomin: 2.04,
        lomax: 2.11,
      }
    });

    const data = response.data.states || [];

    const flights = data
      .filter(entry => {
        const lat = entry[6];
        const lon = entry[5];
        const onGround = entry[8] === true;
        const callsign = (entry[1] || '').trim();

        // Només si té coordenades vàlides i està a terra
        const hasCoords = typeof lat === 'number' && typeof lon === 'number';
        const match = hasCoords && onGround;

        if (match) {
          // Mostrem per consola els callsigns trobats a terra
          console.log('🛬 Vol estacionat detectat:', callsign || '[sense callsign]');
        }

        return match;
      })
      .map(entry => ({
        icao24: entry[0],
        callsign: (entry[1] || '').trim(),
        country: entry[2],
        lat: entry[6],
        lon: entry[5],
        altitude: entry[7],
        velocity: entry[9],
      }));

    res.json(flights);
  } catch (err) {
    console.error('❌ Error accedint a OpenSky:', err.message);
    res.status(err.response?.status || 500).json({
      error: 'Error accedint a OpenSky',
      detail: err.message
    });
  }
});

module.exports = router;
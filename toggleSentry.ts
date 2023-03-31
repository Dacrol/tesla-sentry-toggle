import axios from 'axios';
import fs from 'fs';

const TESLA_API_KEY = fs.readFileSync('.env', 'utf-8').split('=')[1].trim();
const BASE_URL = 'https://owner-api.teslamotors.com/api/1';

async function setSentryMode(vehicleId: string, on: boolean) {
  try {
    const response = await axios.post(
      `${BASE_URL}/vehicles/${vehicleId}/command/set_sentry_mode`,
      { on },
      {
        headers: {
          'Authorization': `Bearer ${TESLA_API_KEY}`,
        },
      },
    );
    console.log(`Sentry Mode ${on ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error toggling Sentry Mode:', error);
  }
}

async function getVehicle() {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${TESLA_API_KEY}`,
      },
    });
    return response.data.response[0].id_s;
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
  }
}

(async () => {
  const now = new Date();
  const vehicleId = await getVehicle();

  if (vehicleId) {
    if (now.getHours() >= 22 || now.getHours() < 6) {
      await setSentryMode(vehicleId, true);
    } else {
      await setSentryMode(vehicleId, false);
    }
  }
})();
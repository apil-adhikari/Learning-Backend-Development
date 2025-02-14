import axios from 'axios';
import { showAlert } from './alerts';

export const addTour = async (form) => {
  try {
    // Create FormData object
    const formData = new FormData(form);

    // Parse startLocation.coordinates into an array of numbers
    const startCoordinatesInput = formData.get('startLocation[coordinates]');
    const [startLocationLongitude, startLocationLatitude] =
      startCoordinatesInput.split(',').map((coord) => parseFloat(coord.trim()));
    if (isNaN(startLocationLongitude) || isNaN(startLocationLatitude)) {
      throw new Error('Invalid start location coordinates.');
    }

    // Parse startDates into an array of strings
    const startDatesInput = formData.get('startDates');
    const startDates = startDatesInput.split(',').map((date) => date.trim());

    // Parse locations into an array of objects
    const locationsInput = formData.get('locations');
    const parsedLocations = locationsInput
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [description, address, coordinates, day] = line
          .split('|')
          .map((item) => item.trim());
        const [latitude, longitude] = coordinates.split(',').map(Number);
        return {
          description,
          address,
          coordinates: [longitude, latitude], // GeoJSON uses [longitude, latitude]
          day: parseInt(day, 10),
        };
      });

    // Construct the final payload
    const jsonData = {
      name: formData.get('name'),
      duration: parseInt(formData.get('duration'), 10),
      maxGroupSize: parseInt(formData.get('maxGroupSize'), 10),
      difficulty: formData.get('difficulty'),
      price: parseFloat(formData.get('price')),
      summary: formData.get('summary'),
      description: formData.get('description'),
      startLocation: {
        description: formData.get('startLocation[description]'),
        address: formData.get('startLocation[address]'),
        coordinates: [startLocationLongitude, startLocationLatitude],
      },
      startDates: startDates,
      locations: parsedLocations,
    };

    // Log the final JSON payload for debugging
    console.log('Sending Payload:', jsonData);

    // Send the data to the backend using Axios
    const response = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data: jsonData,
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
      window.setTimeout(() => {
        location.assign('/manage-tours'); // Redirect to manage tours page
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert(
      'error',
      error.response?.data?.message || 'Failed to create tour.',
    );
  }
};

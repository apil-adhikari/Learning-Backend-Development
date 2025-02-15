/* eslint-disable */
const locations = document.getElementById('map').dataset.locations;
const locationsArray = JSON.parse(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXBpbGFkaGlrYXJpMSIsImEiOiJjbTc2aGRsYjQwY3FhMm9yM3Z2djZsMDRnIn0.TbZ4pR031KjjsG61Zby3eg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/apiladhikari1/cm76hirt600kf01qv6gbi5bih',
  center: [85.324, 27.7172],
  scrollZoom: false,
  zoom: 12,
});

const bounds = new mapboxgl.LngLatBounds();

locationsArray.forEach((location) => {
  const element = document.createElement('div');
  element.className = 'marker';

  new mapboxgl.Marker({
    element: element,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Corrected popup creation and offset application:
  new mapboxgl.Popup({
    offset: 30, // Apply the offset here
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 200,
    right: 200,
  },
});

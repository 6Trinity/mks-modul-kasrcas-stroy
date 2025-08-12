document.addEventListener('DOMContentLoaded', function() {
  const defaultCoords = [55.115853, 61.416978];
  const defaultZoom = 15;
  
  const map = L.map('footer-map').setView(defaultCoords, defaultZoom);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  const marker = L.marker(defaultCoords)
    .addTo(map)
    .bindPopup('МКС МодульКаркасСТрой')
    .openPopup();
});

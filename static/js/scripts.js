var map = L.map('map').setView([19.9561, -99.5307], 14); // Coordenadas de Jilotepec

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var markers = [];
var routeControl;
var fuelEfficiency = 12; // Kilómetros por litro, ajusta según sea necesario
var fuelPrice = 20; // Precio del litro de combustible en tu moneda
var tollCostPerKm = 0.5; // Costo aproximado de peajes por kilómetro

map.on('click', function(e) {
    var marker = L.marker(e.latlng, {draggable: true}).addTo(map);
    markers.push(marker);
    marker.bindPopup("Punto " + markers.length).openPopup();
    marker.on('dragend', updateRoute);
    updateRoute();
});

function updateRoute() {
    if (markers.length > 1) {
        var waypoints = markers.map(function(marker) {
            return L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);
        });

        if (routeControl) {
            map.removeControl(routeControl);
        }

        routeControl = L.Routing.control({
            waypoints: waypoints,
            createMarker: function() { return null; }, // No crear marcadores adicionales
            lineOptions: {
                styles: [{ color: 'blue', opacity: 1, weight: 5 }]
            }
        }).addTo(map);

        routeControl.on('routesfound', function(e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            var distanceKm = (summary.totalDistance / 1000).toFixed(2);
            var timeHours = (summary.totalTime / 3600).toFixed(2);
            var fuelLiters = (distanceKm / fuelEfficiency).toFixed(2);
            var fuelCost = (fuelLiters * fuelPrice).toFixed(2);
            var tollCost = (distanceKm * tollCostPerKm).toFixed(2);

            document.getElementById('distance').value = distanceKm;
            document.getElementById('operating_hours').value = timeHours;
            document.getElementById('fuel_liters').value = fuelLiters;
            document.getElementById('fuel_cost').value = fuelCost;
            document.getElementById('toll_cost').value = tollCost;
        });
    }
}

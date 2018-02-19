
function plantDirectionMap(destLat, destLng, srcLat, srcLng)
{
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: srcLat, lng: srcLng}
  });
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay,destLat, destLng,srcLat, srcLng);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,destLat, destLng,srcLat, srcLng) {
    directionsService.route({
      origin: {lat: srcLat, lng: srcLng},
      destination: {lat: destLat, lng:  destLng},
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        document.getElementById('sidenav').style.display= 'block';
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

function getPlaceFullDetails(place_id){

}
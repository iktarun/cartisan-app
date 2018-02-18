
function plantDirectionMap(destLat, destLng)
      {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 28.448311699999998, lng: 77.04873540000001}
        });
        directionsDisplay.setMap(map);

        calculateAndDisplayRoute(directionsService, directionsDisplay,destLat, destLng);
      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay,destLat, destLng) {
          directionsService.route({
            origin: {lat: 28.448311699999998, lng: 77.04873540000001},
            destination: {lat: destLat, lng:  destLng},
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
      }


var app = angular.module("cartisanApp", ['ngRoute','ngStorage','ngMaterial']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .otherwise({
        template : "<h1>None</h1><p>Nothing has been selected</p>"
    });
});


/************************** Home Controller **************************
*/

app.controller("HomeCtrl", ['$scope','$location','$http','$localStorage','$timeout', '$q', '$log','$window', function ($scope,$location,$http,$localStorage,$timeout,$q,$log,$window) {
  
  //Variable declations
  $scope.city = "";
  $scope.lat  = "";
  $scope.lat  = "";
  $scope.fuelPriceData  = [];
  $scope.RATE_API_URL = "http://localhost:3000/api/get-fuel-price";

  // // Get the user current location
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position){
  //     $scope.$apply(function(){
  //       $scope.city = position;
  //       $scope.getFuelPrice();
  //     });
  //   });
  // }


  // @function getFuelPrice: If user city is found then we will fetch the fuel rates from api's
  $scope.getFuelPrice = function(){
    
    if($scope.city){
      $http({
           method: 'POST',
           url: $scope.RATE_API_URL,
           headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           data: 'city=Gurgaon&fuel_type=petrol'
       }).then(function mySuccess(response) {
            console.log(response);
            if(response.data.status == true){
              if(response.data.data){
                $scope.fuelPriceData  = response.data.data;
              }else{
                console.log("No data available for user");
              }
            }
          }, function myError(response) {
              console.log("Error in User search data");
          });
    }
  }

  /** 
    *This area detals with getting user current GEO location data
    * 
  **/
  
  var geocoder;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 

  // //Get the latitude and the longitude;
  function successFunction(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      $localStorage.lat = lat;
      $localStorage.lng = lng;
      codeLatLng(lat, lng);
  }

  function errorFunction(){
    alert("Geocoder failed");
  }

  function initialize() {
    console.log("Application initialized.");
    geocoder = new google.maps.Geocoder();
  }

  function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      
      if (status == google.maps.GeocoderStatus.OK) {

        if (results[0]) {
          //formatted address
          alert(results[0].formatted_address)
          //find country name
            for (var i=0; i<results[0].address_components.length; i++) {
              for (var b=0;b<results[0].address_components[i].types.length;b++) {
              //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
              }
            }
        //city data
        alert(city.short_name + " " + city.long_name);
        $localStorage.city  = city.short_name;
        $scope.city         = city.short_name;  
        $scope.$digest();
        $scope.getFuelPrice();
        $scope.initMap();

        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  initialize();

   /** 
    *This area detals with drawing gas station marker using current GEO location data
    * 
  **/

  var map;
  var infowindow;

  $scope.initMap = function() {

    var pyrmont = {lat: $localStorage.lat, lng: $localStorage.lng};

    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: pyrmont,
      radius: 1000,
      type: ['gas_station']
    }, callback);
  }

  function callback(results, status) {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var destLat  = place.geometry.location.lat();
    var destLng  = place.geometry.location.lng();
    console.log('destLat:'+destLat+'destLng:'+destLng);
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {

       infowindow.setContent('<div><img src="'+place.icon+'" />\
          <strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' +
            'Ratting: ' + place.rating + '<br>' +
            '<button type="button" onclick="plantDirectionMap('+destLat+','+destLng+');">Go</button>' +
            '</div>');

      infowindow.open(map, this);
    });
  }


}]);


/* End of Home Controller */




/* TODO 
https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=8&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg

create a string for this map and change the source of the element with ID map to match this plus the additional path.

*/

var user = detect.parse(navigator.userAgent);
console.log(
  user.browser.family,
  user.browser.version,
  user.os.name
 );

const map = document.getElementById("map");

function calcRoute(){
/*
  var orig = document.getElementById("orig");
  var dest = document.getElementById("dest");
*/
  var orig = {lat: 40.71303542062185, lng: -74.00801175633978} /* user location */;
  var dest = {lat: 40.71580432662713, lng: -73.99684223456448} /* petrol station */;
  var start = orig.lat + "," + orig.lng;
  var end = dest.lat + "," + dest.lng;
 

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  var request;
  directionsService.route({
    origin: orig,
    destination: dest,
    travelMode: "DRIVING",
  },
  (response, status)=> {
    console.log(response);
    console.log(response.routes[0].legs[0].start_location);
    console.log(status);
    var path = response.routes[0].overview_polyline;
    var markers = [];
    var waypoints_labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
    var waypoints_label_iter = 0;
    markers.push("markers=color:green|label:" + waypoints_labels[waypoints_label_iter] + '|' + start);
    waypoints_label_iter++;
    markers.push("markers=color:blue|label:" + waypoints_labels[waypoints_label_iter] + '|' + end);
    markers = markers.join('&');
    map.src = ("https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=14&size=1000x1000&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg&maptype=roadmap&path=enc:" + path + "&" + markers);


  });


}





// Needs to come up with street view image
// Needs to come up with map directions
// The displayed output needs to be lightweight and as simple and streamlined as possible or else the page will be overloaded with distracting details
// I noticed google maps embeds can be very heavy on the page and create a lot of clutter and distract from the app's core purpose, so we will need to weigh this up and adapt if possible

/* TODO 
https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=8&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg
*/











/*for loop searching for each map, to run on this page being loaded */
/* only top 5 stations */

var mapList = document.getElementsByClassName("map");
var maxStations = 5;
for(var i=0; i<maxStations; i++){
    
    calcRoute(mapList[i].id);




}







/* function to calculate the route for each ma */

function calcRoute(mapLabel){

    const map = document.getElementById(mapLabel);

  var orig = {lat: 0, lng: 0};
  var dest = {lst: 0, lng: 0};

/*
  var orig = {lat: 40.71303542062185, lng: -74.00801175633978} // user location ;
  var dest = {lat: 40.71580432662713, lng: -73.99684223456448}  // petrol station ;
  */
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





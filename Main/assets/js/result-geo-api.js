
/* TODO 
https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=8&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg
*/


var fuelRequest =
{"stations":[{"brandid":"1-GFYV-6","stationid":"1-GPPT-163","brand":"Metro Fuel","code":1046,"name":"Metro Fuel Canterbury","address":"280 Canterbury Road, Canterbury NSW 2193","location":{"distance":0.43,"latitude":-33.914023,"longitude":151.115187},"state":"NSW"}
,{"brandid":"1-GFYV-2","stationid":"1-GPPT-328","brand":"Budget","code":1229,"name":"Budget Campsie","address":"403 Canterbury Road, Campsie NSW 2194","location":{"distance":0.78,"latitude":-33.916148,"longitude":151.108753},"state":"NSW"}
,{"brandid":"1-GFYV-5","stationid":"1-35MMKJG","brand":"Independent","code":17288,"name":"Xpress fuels","address":"134 Brighton Ave, CAMPSIE NSW 2194","location":{"distance":1.00,"latitude":-33.903373,"longitude":151.106875},"state":"NSW"}
,{"brandid":"1-GFYV-6","stationid":"1-3KFNTWA","brand":"Metro Fuel","code":18305,"name":"Metro Hurlstone Park","address":"13-19 CANTERBURY RD, CANTERBURY NSW 2193","location":{"distance":1.11,"latitude":-33.907813,"longitude":151.125233},"state":"NSW"}]}

//console.log(fuelRequest.stations[0].location.latitude);
//console.log(fuelRequest.stations[0].location.longitude);

/*for loop searching for each map, to run on this page being loaded */
/* only top 5 stations */
function generateRoute(){
var mapList = document.getElementsByClassName("map");
//console.log(mapList);
var maxStations = 4;


for(var i=0; i<maxStations; i++){
    console.log(fuelRequest.stations[i].location.latitude);
    calcRoute(mapList[i].id, i);
}
}
/* function to calculate the route for each ma */

function calcRoute(mapLabel, station_iter){

    const map = document.getElementById(mapLabel);

  var orig = {lat: -33.9106, lng: 151.1564};
  var dest = {lat: fuelRequest.stations[station_iter].location.latitude, lng: fuelRequest.stations[station_iter].location.longitude};

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
    map.src = ("https://maps.googleapis.com/maps/api/staticmap?center=-33.9106,151.1564&zoom=12&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg&maptype=roadmap&path=enc:" + path + "&" + markers);


  });

  generateRoute();


}







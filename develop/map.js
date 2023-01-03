navigator.geolocation.getCurrentPosition(
  function (position) {
     initMap(position.coords.latitude, position.coords.longitude)
  },
  function errorCallback(error) {
     console.log(error)
  }
);
// initiates Map and stores the user geolocation
function initMap(lat, lng) {
    var myLatLng = {
     lat,
     lng
};
  //centre map to the users current location
   var map = new google.maps.Map(document.getElementById('map'), {
   zoom: 12,
   center: myLatLng
   }
);

  //Add Users location marker if location permissions accepted
     var UserMarker = new google.maps.Marker({
     position: myLatLng,
     map: map,
     title: "My Location",

  }
);


// adds radius around user location. This is defaulted before the user selects paramaters. Can change to toggle with radius selection.
  var circle = new google.maps.Circle({
   center: myLatLng,
   map: map,
   radius: 5000,          
   fillColor: '#FF6600',
   fillOpacity: 0.2,
   strokeColor: "#FF0000",
   strokeWeight: 2,         
   editable: false
});

 

//    // array of markers manual test
//    var fuelMarkers =[
//       {
//          coords:{ lat:-33.42689039710051, lng:151.32895480381032},
//          title: "Fuel 1",
//          label: "A",
//       },
//       {
//          coords:{ lat:-33.426887231322276, lng:151.32912170531685},
//          title: "Fuel 2",
//          label: "B",
//        },
//       {
//          coords:{ lat:-33.42688613391998, lng:151.33045335384972},
//          title: "Fuel 3",
//          label: "C",
//       },
//     ];
   
//     //loop through array of markers
//     for (var i = 0; i <fuelMarkers.length;i++){
//       //add marker to map
//       addFuelMarkers(fuelMarkers[i]); 
//    }
 


// // add marker function
//       function addFuelMarkers(property){
//       const marker = new google.maps.Marker({
// /      position: property.coords,
//       icon:"http://maps.google.com/mapfiles/kml/shapes/gas_stations.png",
//       label: property.label,
//       map: map, // put the map on the map (  can also do marker.setMap(map);)
//       title: property.title,
//   });


//code based on the json array from the api call

var main_array =
{"stations":[{"brandid":"1-GFYV-6","stationid":"1-GPPT-163","brand":"Metro Fuel","code":1046,"name":"Metro Fuel Canterbury","address":"280 Canterbury Road, Canterbury NSW 2193","location":{"distance":0.43,"latitude":-33.914023,"longitude":151.115187},"state":"NSW"},{"brandid":"1-GFYV-2","stationid":"1-GPPT-328","brand":"Budget","code":1229,"name":"Budget Campsie","address":"403 Canterbury Road, Campsie NSW 2194","location":{"distance":0.78,"latitude":-33.916148,"longitude":151.108753},"state":"NSW"},{"brandid":"1-GFYV-5","stationid":"1-35MMKJG","brand":"Independent","code":17288,"name":"Xpress fuels","address":"134 Brighton Ave, CAMPSIE NSW 2194","location":{"distance":1.00,"latitude":-33.903373,"longitude":151.106875},"state":"NSW"},{"brandid":"1-GFYV-6","stationid":"1-3KFNTWA","brand":"Metro Fuel","code":18305,"name":"Metro Hurlstone Park","address":"13-19 CANTERBURY RD, CANTERBURY NSW 2193","location":{"distance":1.11,"latitude":-33.907813,"longitude":151.125233},"state":"NSW"}]}





//loop through array
for (var i = 0; i < main_array.stations.length; i++)
addFuelMarkers(main_array.stations[i]);

  // add marker function using api call
  function addFuelMarkers(property){
   const marker = new google.maps.Marker({
   position: {lat: property.location.latitude, lng:property.location.longitude},
   icon:"http://maps.google.com/mapfiles/kml/shapes/gas_stations.png",
   label: 'add rank',
   map: map, // put the map on the map (  can also do marker.setMap(map);)
   title: property.name +  "Price:" + property.location.distance,
});
   

//call user marker function  
UserMarker;


}

}
window.initMap = initMap;
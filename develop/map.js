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

 

   // array of markers
   var fuelMarkers =[
      {
         coords:{ lat:-33.42689039710051, lng:151.32895480381032},
         title: "Fuel 1",
         label: "A",
      },
      {
         coords:{ lat:-33.426887231322276, lng:151.32912170531685},
         title: "Fuel 2",
         label: "B",
       },
      {
         coords:{ lat:-33.42688613391998, lng:151.33045335384972},
         title: "Fuel 3",
         label: "C",
      },
    ];
   
    //loop through array of markers
    for (var i = 0; i <fuelMarkers.length;i++){
      //add marker to map
      addFuelMarkers(fuelMarkers[i]); 
   }
 
//add event listener 
// document.getElementById("btn-search").addEventListener("click",

// add marker function
      function addFuelMarkers(property){
      const marker = new google.maps.Marker({
      position: property.coords,
      icon:"http://maps.google.com/mapfiles/kml/shapes/gas_stations.png",
      label: property.label,
      map: map, // put the map on the map (  can also do marker.setMap(map);)
      title: property.title,
  });
   
//call user marker function  
UserMarker;


}

}
window.initMap = initMap;
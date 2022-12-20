let map;
const myLatLng = { lat: -25.363, lng: 131.044 };



var x = document.getElementById("demo");

document.getElementById("locBtn").addEventListener("click", function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
});

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude ;
  "<br>Longitude: " + position.coords.longitude;

    myLatLng.lat = position.coords.latitude;
    myLatLng.lng = position.coords.longitude;
    const map = new google.maps.Map(document.getElementById("map"),{
        zoom: 10,
        center: myLatLng,
    });
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "My Location!",
    });
    console.log(myLatLng);

}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: myLatLng,
      });
    
      new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
      });
}



window.initMap = initMap;


// Latitude distance for 5km is 0.0318 and 0.0318
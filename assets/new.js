// Check to see if this browser supports geolocation.
if (navigator.geolocation) {


    // This is the location marker that we will be using on the map. Let's store a reference to it here so that it can be updated in several places.
    var locationMarker = null;
    var myLat = null;
    var myLng = null;


    // Get the location of the user's browser using the native geolocation service.
    navigator.geolocation.getCurrentPosition(
        function (position) {





            // Log that this is the initial position.
            console.log( "Initial Position Found" );
            
            // Assign coordinates to global variables
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            
            moveToLocation(myLat, myLng);


        }
        
    );


}


// Start the Google Maps implementation
var map;
var markersArray = [];
function initialize() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(40.760779, -111.891047),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // Add a click event handler to the map object
    google.maps.event.addListener(map, "click", function(event) {
        // Place a marker
        placeMarker(event.latLng, event.latLng.lat(), event.latLng.lng());
        
        // Display the lat/lng in your form's lat/lng fields
        //document.getElementById("lat").value = event.latLng.lat();
        //document.getElementById("lng").value = event.latLng.lng();
    });
    
    // Add a click event handler to the marker object
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("Your content here");
        infowindow.open(map, this);
    });
    
}


function placeMarker(location, lat, lng) {
    // Remove all markers if there are any
    deleteOverlays();
    
    var marker = new google.maps.Marker({
        position: location, 
        map: map
    });
    
    // Add marker in markers array
    markersArray.push(marker);
    
    var contentString = '<a href="/post/start.php?Lat=' + lat + '&Lng=' + lng + '">New Listing</a>';
    
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    infowindow.open(map,marker);
    
    //map.setCenter(location);
}
    
// Deletes all markers in the array by removing references to them
function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}


function moveToLocation(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
}


google.maps.event.addDomListener(window, 'load', initialize);
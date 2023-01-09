var credentials;
var fuelName;
var sortByCode;
var sortByName;
var fuelCode;
var rank;

var current_code;

var countOfReturnedResults;

var radiusM;

var fuelRequest;

var x;
var y;

var map;

// initiates Map and stores the user geolocation

async function initMap(main_array) {
  var myLatLng = { lat: Number(latitude), lng: Number(longitude) };
  // var myLatLng = {
  //  lat,
  //  lng

  //centre map to the users current location
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: myLatLng,
  });

  //Add Users location marker if location permissions accepted
  var UserMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "My Location",
  });

  // adds radius around user location. This is defaulted before the user selects paramaters. Can change to toggle with radius selection.
  var circle = new google.maps.Circle({
    center: myLatLng,
    map: map,
    radius: radiusM,
    fillColor: "#FF6600",
    fillOpacity: 0.2,
    strokeColor: "#FF0000",
    strokeWeight: 2,
    editable: false,
  });

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

  //loop through array
  for (var i = 0; i < countOfReturnedResults; i++)
    addFuelMarkers(main_array.stations[i]);

  // add marker function using api call
  function addFuelMarkers(property) {
    const marker = new google.maps.Marker({
      position: {
        lat: property.location.latitude,
        lng: property.location.longitude,
      },
      icon: "http://maps.google.com/mapfiles/kml/shapes/gas_stations.png",
      label: (i + 1).toString(),
      map: map, // put the map on the map (  can also do marker.setMap(map);)
      title: property.name + "Price:" + property.location.distance,
    });

    //call user marker function
    UserMarker;
  }
}

// SET GLOBALS

// var globalAccessToken = "QdGf3YaifPEzy9rbYpwwKvhFDm6o";
var globalAccessToken;

// Define elements
var resultsContainer = document.getElementById("results-container");

//??
// window.addEventListener("load", (event) => {

// });

// Define modals
var inputMissingModal = new bootstrap.Modal(
  document.getElementById("input-missing-modal")
);
var geolocMissingModal = new bootstrap.Modal(
  document.getElementById("geoloc-perms-err")
);

// Using test API
var auth =
  "Basic MU1ZU1JBeDV5dnFIVVpjNlZHdHhpeDZvTUEycWdmUlQ6Qk12V2FjdzE1RXQ4dUZHRg==";
var apikey = "1MYSRAx5yvqHUZc6VGtxix6oMA2qgfRT";

// Using free registered API
// var auth = "Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==";
// var apikey = "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4";

var sortascending = "true";

var fuelSelect = document.getElementById("fuel-select");

// Geolocation API

var namedLocation = "Canterbury Leisure and Aquatic Centre";
// I assume namedLocation can be whatever you want and does not have to be an actual postcode or something?

// Sydney CBD??
// var latitude = "-33.9104";
// var longitude = "151.1136";

var latitude;
var longitude;

// Fire modal if geolocation unavailable
// if (!latitude || !longitude) {
//   geolocMissingModal.show();
// } else

if (latitude && longitude) {
  // Display geoloc coordinates

  var h1HeadingEle = document.getElementById("main-h1");
  const geoCoordinates = document.createElement("div");
  geoCoordinates.innerHTML = `Your detected device geocoordinates are: latitude <span id="user-latitude">${latitude}</span>, longitude <span id="user-longitude">${longitude}</span>.`;
  h1HeadingEle.parentNode.insertBefore(
    geoCoordinates,
    h1HeadingEle.nextSibling
  );
  // If referenceNode is the last child within its parent element, that's fine, because referenceNode.nextSibling will be null and insertBefore handles that case by adding to the end of the list.
  // https://stackoverflow.com/a/4793630/9095603
}

// RESET form
// https://www.geeksforgeeks.org/how-to-reset-all-form-values-using-a-button-in-html/
// https://www.w3schools.com/jsref/met_form_reset.asp

// DEFINE INPUTS

var fuelOptionEle = document.getElementById("fuel-select");
var radiusOptionEle = document.getElementById("radius-select");
var rankingOptionEle = document.getElementById("ranking-select");

// DEFINE FETCH BUTTON AND EVENTS

var brandsArray;

var fuelType;
var radius;
var sortByWhat;

// console.log({globalAccessToken})
//   setTimeout(wait5,5000);
//   function wait5(){
//     remainingFetch();
//   }

/* Sarah's code */

document.addEventListener("DOMContentLoaded", () => {
  // https://flaviocopes.com/dom-ready/

  // load versus DOMContentLoaded:
  // The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images. This is in contrast to DOMContentLoaded, which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event

  // FUNCTIONS

  // An on and off switch for the loading overlay which prevents user interaction while the page is being loaded or searches are executing

  function loadingOverlayOn() {
    document
      .getElementsByClassName("overlay")[0]
      .style.setProperty("display", "block");
  }
  function loadingOverlayOff() {
    document
      .getElementsByClassName("overlay")[0]
      .style.setProperty("display", "none", "important");
  }

  // You want to run the fetch to get the brands (full range is assumed for search) and fuelType (options) from the get go
  async function getCredentials() {
    try {
      let response = await fetch(
        "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
        {
          headers: {
            accept: "application/json",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            authorization: auth,
            // "Basic MU1ZU1JBeDV5dnFIVVpjNlZHdHhpeDZvTUEycWdmUlQ6Qk12V2FjdzE1RXQ4dUZHRg==",
          },
          // referrerPolicy: "no-referrer",
          // body: null,
          method: "GET",
        }
      );
      let data = await response.json();
      globalAccessToken = data.access_token;
      console.log("here:" + data.access_token);
      console.log("here globalAccessToken:" + globalAccessToken);
      return globalAccessToken;
    } catch (error) {
      console.log(error);
    }
  }

  async function populateForm(credentials) {
    try {
      console.log("Check globalAccessToken: " + globalAccessToken);
      console.log("Received as argument: " + credentials);

      let response = await fetch(
        "https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
        {
          headers: {
            accept: "application/json",
            apikey: apikey,
            authorization: `Bearer ${credentials}`,
            "content-type": "application/json; charset=utf-8",
            "if-modified-since": "25/12/2022 05:00:00 AM",
            requesttimestamp: "25/12/2022 05:00:00 AM",
            transactionid: "5",
          },
          method: "GET",
        }
      );

      console.log("check line 295: " + response);
      let data = await response.json();

      // Add fuel types for form
      var fuelTypes = data.fueltypes;

      //   console.log({ fuelTypes });

      for (let i = 0; i < fuelTypes.items.length; ++i) {
        fuelName = fuelTypes.items[i].name;
        fuelCode = fuelTypes.items[i].code;
        // console.log({ fuelName });
        // console.log({ fuelCode });
        if (
          fuelName != "Ethanol 94 / Unleaded 91" &&
          fuelName != "Premium 95 / Premium 98" &&
          fuelName != "Diesel / Premium Diesel" &&
          fuelName != "CNG/NGV" &&
          fuelName != "Hydrogen" &&
          fuelName != "LNG"
        ) {
          fuelSelect.add(new Option(fuelName, fuelCode));

          // localStorage.setItem()
          // https://www.javascripttutorial.net/javascript-dom/javascript-add-remove-options/
          // https://stackoverflow.com/a/73725875/9095603
        }
      }

      // Add fuel brands - you will use all of them automatically in the search
      // Brands should be dynamic, as in theory new brands could be added and old ones phased out
      var fuelBrands = data.brands.items;
      //   console.table(fuelBrands);

      brandsArray = [];
      for (let i = 0; i < fuelBrands.length; ++i) {
        brandsArray.push(fuelBrands[i].name);
      }

      var selectedBrand = fuelBrands;
      //   console.log(selectedBrand);
      //   console.log({ brandsArray });

      // Dynamically get sort-by fields

      for (let i = 0; i < data.sortfields.items.length; ++i) {
        sortByCode = data.sortfields.items[i].code;
        sortByName = data.sortfields.items[i].name;
        // console.log({ sortByCode });
        // console.log({ sortByName });

        document
          .getElementById("ranking-select")
          .add(new Option(sortByName, sortByCode));
      }

      // Dynamically display number of stations
      document.getElementById("station-count").innerText =
        data.stations.items.length;
    } catch (error) {
      console.log(error);
    }
  }

  async function attachListenerToButton() {
    document.getElementById("fetch").addEventListener("click", function (e) {
      e.preventDefault();

      saveHistory();

      // Fire modal if geolocation unavailable
      if (!latitude || !longitude) {
        geolocMissingModal.show();
      } else {
        fuelType = fuelOptionEle.options[fuelOptionEle.selectedIndex].value;
        console.log(fuelType);

        radius = radiusOptionEle.options[radiusOptionEle.selectedIndex].value;
        console.log(radius);
        if (!radius) {
          radius = "";

          radiusOptionEle.value = "unlimited";
        }
        if (radius) {
          radiusM = radius * 1000;
        }
        sortByWhat =
          rankingOptionEle.options[rankingOptionEle.selectedIndex].value;
        console.log(sortByWhat);

        // Add missing inputs modal
        // if (!fuelType || !radius || !sortByWhat) {
        if (!fuelType || !sortByWhat) {
          // Clear out any previous error messages
          document.getElementById("missing-text-before").innerHTML = "";
          document.getElementById("missing-inputs").innerHTML = "";
          document.getElementById("missing-text-after").innerHTML = "";
          var plural;

          // Reset array
          var missingArray = [];

          if (!fuelType) {
            missingArray.push("Fuel type");
          }
          if (!radius) {
            missingArray.push("Radius");
          }
          if (!sortByWhat) {
            missingArray.push("Rank by");
          }

          for (var i = 0; i < missingArray.length; i++) {
            var liNode = document.createElement("li");
            var txtNode = document.createTextNode(`${missingArray[i]}`);
            liNode.appendChild(txtNode);
            document.getElementById("missing-inputs").appendChild(liNode);
          }

          // Plural

          if (missingArray.length > 1) {
            plural = "s";
          } else {
            plural = "";
          }

          document.getElementById(
            "missing-text-before"
          ).innerHTML = `Error: you are missing the following selection${plural}:`;
          document.getElementById(
            "missing-text-after"
          ).innerHTML = `Please try again after you have made your selection${plural}.`;
          document.getElementById(
            "exampleModalLongTitle"
          ).innerHTML = `Missing selection${plural}!`;

          // Fire the modal
          inputMissingModal.show();
        } else {
          runSearch();
        }
      }
    });
  }

  async function displayResult(main_array) {
    console.log({ main_array });
    console.log({ resultsContainer });

    // Check if at least some stations fall inside radius
    var arrayDltR = [];
    for (var i = 0; i < main_array.stations.length; i++) {
      console.log("distance: " + main_array.stations[i].location.distance);
      console.log({ radius });
      if (main_array.stations[i].location.distance <= radius) {
        // array Distance less than Radius
        arrayDltR.push(true);
      } else {
        arrayDltR.push(false);
      }
    }

    // If there are not at least some stations inside radius, then report as such to user, advise to broaden radius and end program - the Search Again button will become available
    console.log({ arrayDltR });
    if (arrayDltR.some((value) => value === true)) {
      console.log("At least some service stations found inside of radius.");
    } else {
      console.log(
        "No service stations were found inside your specified radius.  Please broaden your radius and try again."
      );
      var resultsCountEle = document.createElement("div");
      resultsCountEle.innerText =
        "No service stations were found inside your specified radius.  Please broaden your radius and try again.";
      resultsContainer.appendChild(resultsCountEle);

      appendSearchAgainButton();

      // then exit the function
      return;
    }

    var resultsCountEle = document.createElement("h2");

    // be careful to ensure this limit is limiting to the TOP 10 results and not to the BOTTOM 10
    if (main_array.stations.length > 10) {
      countOfReturnedResults = 10;
      resultsCountEle.innerHTML = `10 results returned (actually ${main_array.stations.length} found, but limited to best 10):`;
    } else if (
      main_array.stations.length > 0 &&
      main_array.stations.length <= 10
    ) {
      countOfReturnedResults = main_array.stations.length;
      resultsCountEle.innerHTML = `${main_array.stations.length} results found:`;
    } else if (main_array.stations.length <= 0) {
      countOfReturnedResults = 0;
      resultsCountEle.innerHTML = `No results found. Try relaxing or broadening your search parameters.`;
      // unlike the conditions above, the append elements are required here because the program will now exit
      resultsContainer.appendChild(resultsCountEle);
      appendSearchAgainButton();
      return;
    }

    resultsContainer.appendChild(resultsCountEle);

    var bigMap = document.createElement("div");
    bigMap.setAttribute("id", "map");
    bigMap.setAttribute("class", "img-fluid");

    resultsContainer.appendChild(bigMap);

    for (var i = 0; i < main_array.stations.length; i++) {
      // you can't limit by using a fixed/static number because there will be cases where i does not even reach 20, for example, so use an if breakout condition:
      if (i === 10) {
        // countOfReturnedResults = 10;
        // i = 19 was the 20th, so we do nothing from i = 20
        break;
      }

      // If none of the returned stations are within the radius then return: "there are no stations inside your radius.  Please try again and broaden the radius."

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
      // for stricter condition, you can use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every

      console.log(main_array.stations[i].location.distance);

      current_code = main_array.stations[i].code;
      console.log({ current_code });

      console.log(main_array.stations[i].code);
      console.log(main_array.stations[i].name);
      console.log(main_array.stations[i].address);
      console.log(main_array.stations[i].location.latitude);
      console.log(main_array.stations[i].location.longitude);

      // var indexOfInterest = main_array.prices.findIndex(
      //   function(sub) {

      //     return sub.indexOf(
      //       function(blah){
      //         return blah.stationcode = current_stationid
      //         // https://stackoverflow.com/a/39810268/9095603
      //       }) !== -1;
      //     // The indexOf() method returns -1 if the value is not found.
      //     // https://www.w3schools.com/jsref/jsref_indexof_array.asp

      // });

      // main_array.prices.forEach(element => {console.log(typeof element )});

      console.table(main_array.prices);

      var indexOfInterest = main_array.prices.findIndex((sub) => {
        return sub["stationcode"] == current_code;

        // return sub.indexOf(
        //   sub.stationcode == current_code
        //   ) !== -1;
        // The indexOf() method returns -1 if the value is not found.
        // https://www.w3schools.com/jsref/jsref_indexof_array.asp
      });

      console.log(indexOfInterest);

      // Get price for corresponding
      var the_price = main_array.prices[indexOfInterest].price;
      var lastUpdated = main_array.prices[indexOfInterest].lastupdated;
      console.log({ the_price });
      console.log({ lastUpdated });

      let resultsSlot = document.createElement("div");
      resultsSlot.setAttribute("class", `station-index-${indexOfInterest}`);
      resultsContainer.appendChild(resultsSlot);

      rank = i + 1;

      resultsSlot.innerHTML = `


      <style>
   
      
      </style>

<div id="${
        main_array.stations[i].code
      }" class="card mb-3" style="max-width: 768px;">

  <div class="row g-0">
    <div class="col-md-6">
      <!-- for Dylan's little maps class = "map", and id = "map1"+ -->
      <img id="map${i + 1}" class="img-fluid rounded-start map" >
    </div>
    <div class="col-md-6">
      <div class="card-body">

      <span id="favourite-tag">favourite<div><i class="fa-solid fa-heart"></i></div></span>

        <h5>Rank #${rank} by ${sortByWhat}</h5>
        <h3>${main_array.stations[i].name}</h3>

        <div style="padding:4px;">${the_price} cents/Litre</div><div style="padding:4px;">${
        main_array.stations[i].location.distance
      } km</div>

        <p class="card-text">
                
        <table>
        <tbody>
        <tr><th>Station code:</th><td>${main_array.stations[i].code}</td></tr>
        <tr><th>Street Address:</th><td>${
          main_array.stations[i].address
        }</td></tr>
        <tr><th>Longitude:</th><td>${
          main_array.stations[i].location.latitude
        }</td></tr>
        <tr><th>Latitude:</th><td>${
          main_array.stations[i].location.longitude
        }</td></tr>
        </tbody>
        </table>

        </p>
        <p class="card-text"><small class="text-muted">Last price change at: ${lastUpdated}</small></p>
        <button id="${
          main_array.stations[i].code
        }-save-btn" type="button">&#x2764; Save to favourites</button>
        <button id="${
          main_array.stations[i].code
        }-unsave-btn" type="button">&#x1F494; Remove from favourites</button>
        <p class="card-text"><small><a href="#">View and manage favourites</a></small></p>
      </div>
    </div>
  </div>
</div>
`;

      toggleSaveToFav(main_array.stations[i].code);
    }

    appendSearchAgainButton();
  }

  function appendSearchAgainButton() {
    // Append search again button at end
    const stickPanelBottom = document.createElement("div");
    stickPanelBottom.style.setProperty("class", "text-center");
    document.getElementById("results-container").appendChild(stickPanelBottom);

    const searchAgainBtn = document.createElement("button");
    searchAgainBtn.innerHTML = "Search again";
    searchAgainBtn.setAttribute("type", "submit");
    searchAgainBtn.setAttribute("id", "search-again-btn");

    searchAgainBtn.setAttribute("onClick", "window.location.reload();");

    resultsContainer.appendChild(searchAgainBtn);
  }

  async function runSearch() {
    var searchPanel = document.getElementById("search-parent-container");
    searchPanel.style.setProperty("display", "none");

    loadingOverlayOn();
    try {
      let response = await fetch(
        // if needed https://cors-anywhere.herokuapp.com/
        // then, if needed go to https://cors-anywhere.herokuapp.com/corsdemo and click to get server permissions
        "https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby",
        {
          headers: {
            apikey: apikey,
            authorization: `Bearer ${globalAccessToken}`,
            "content-type": "application/json",
            requesttimestamp: "28/12/2022 01:30:00 PM",
            transactionid: "4",
          },
          body: JSON.stringify({
            fueltype: fuelType,
            brand: brandsArray,
            namedlocation: namedLocation,
            latitude: latitude,
            longitude: longitude,
            radius: radius,
            sortby: sortByWhat,
            sortascending: sortascending,
          }),
          method: "POST",
        }
      );
      // END HERE )
      let data = await response.json();

      // Now if we stringify it, it should be in the correct format for localStorage
      localStorage.setItem("serializedResponse", JSON.stringify(response));

      localStorage.setItem("Response", response);
      localStorage.setItem("data", data);
      // // retrieving the serializedResponse
      // var myObj = localStorage.getItem("serializedResponse");
      // console.log("Before JSON.parse(): ", myObj);
      // console.table("Before JSON.parse(): ", myObj);

      // let myObjDeserialized = JSON.parse(
      //   localStorage.getItem("serializedResponse")
      // );
      // console.log("After JSON.parse(): ", myObjDeserialized);
      // console.table("After JSON.parse(): ", myObjDeserialized);

      // console.log(myObjDeserialized);
      // console.table(myObjDeserialized);
      // console.log(myObjDeserialized.stations[0].location.distance);
      // console.table(myObjDeserialized.stations[0].location.distance);

      // console.log(myObjDeserialized.prices);
      // console.table(myObjDeserialized.prices);
      // console.log(myObjDeserialized.stations[7].stationid);
      // console.table(myObjDeserialized.stations[7].stationid);

      // console.log(myObjDeserialized.prices[3].price);
      // console.table(myObjDeserialized.prices[3].price);

      await displayResult(data);
      // window.initMap = initMap;
      await initMap(data);
      await generateSmallMaps(data);
      loadingOverlayOff();
    } catch (err) {
      console.log(err);
    }
    //   } else {
    //     console.log("Using localStorage data");
    //     let myObj = localStorage.getItem("serializedResponse");
    //     console.log("Before JSON.parse(): ", myObj);
    //     console.table("Before JSON.parse(): ", myObj);

    //     console.log("After JSON.parse(): ", myObj.stations);
    //     console.table("After JSON.parse(): ", myObj.stations);

    //     let myObjDeserialized = JSON.parse(
    //       localStorage.getItem("serializedResponse")
    //     );
    //     console.log("After JSON.parse(): ", myObjDeserialized);
    //     console.table("After JSON.parse(): ", myObjDeserialized);

    //     console.log("After JSON.parse(): ", myObjDeserialized.stations);
    //     console.table("After JSON.parse(): ", myObjDeserialized.stations);

    //     console.log(myObjDeserialized.prices);
    //     console.table(myObjDeserialized.prices);
    //     console.log(myObjDeserialized.stations);
    //     console.table(myObjDeserialized.stations);
    //     console.log(myObjDeserialized.stations.location);
    //     console.table(myObjDeserialized.stations.location);

    //     console.log("Yo");
    //     for (var i = 0; i < myObjDeserialized.stations.length; i++) {
    //       console.log(myObjDeserialized.stations[i].location);
    //       console.table(myObjDeserialized.stations[i].location);
    //     }

    //     displayResult(myObjDeserialized);

    //   }
    // }
  }

  async function runApp() {
    loadingOverlayOn();
    // isLoading = true;

    var para2 = document.createElement("p");
    para2.setAttribute("id", "outPutGeoLocErr");

    // geoloc Modal Element
    y = document
      .querySelector("#geoloc-perms-err .modal-body")
      .appendChild(para2);
    y.innerHTML = "Sup man";

    // Top of page under heading insert
    var para = document.createElement("p");
    para.setAttribute("id", "getLocationOutput");

    var h1Ele = document.querySelector("#main-h1");

    h1Ele.parentNode.insertBefore(para, h1Ele.nextSibling);

    x = document.getElementById("getLocationOutput");

    await getLocation();

    credentials = await getCredentials();
    console.log("credentials in runApp(): " + credentials);

    await Promise.all([populateForm(credentials), attachListenerToButton()]);
    // https://stackoverflow.com/a/35612484/9095603

    loadingOverlayOff();
    // isLoading = false;
  }

  runApp();
});

async function generateSmallMaps(main_array) {
  /* TODO 
https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=8&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg
*/

  fuelRequest = main_array;
  console.log({ fuelRequest });
  for (var i = 0; i < countOfReturnedResults; i++) {
    calcRoute(`map${i + 1}`, i);
  }
}

/* function to calculate the route for each map */

function calcRoute(mapLabel, station_iter) {
  const map = document.getElementById(mapLabel);

  var orig = { lat: -33.9106, lng: 151.1564 };
  var dest = {
    lat: fuelRequest.stations[station_iter].location.latitude,
    lng: fuelRequest.stations[station_iter].location.longitude,
  };

  var start = orig.lat + "," + orig.lng;
  var end = dest.lat + "," + dest.lng;

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  var request;
  directionsService.route(
    {
      origin: orig,
      destination: dest,
      travelMode: "DRIVING",
    },
    (response, status) => {
      console.log(response);
      console.log(response.routes[0].legs[0].start_location);
      console.log(status);
      var path = response.routes[0].overview_polyline;
      var markers = [];
      var waypoints_labels = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
      ];
      var waypoints_label_iter = 0;
      markers.push(
        "markers=color:green|label:" +
          waypoints_labels[waypoints_label_iter] +
          "|" +
          start
      );
      waypoints_label_iter++;
      markers.push(
        "markers=color:blue|label:" +
          waypoints_labels[waypoints_label_iter] +
          "|" +
          end
      );
      markers = markers.join("&");
      map.src =
        "https://maps.googleapis.com/maps/api/staticmap?center=-33.9106,151.1564&zoom=12&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg&maptype=roadmap&path=enc:" +
        path +
        "&" +
        markers;
    }
  );
}

// check if location setting has been turned off in users browser
// https://stackoverflow.com/a/14862073/9095603

async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    y.innerHTML = "Geolocation is not supported by this browser.";
    geolocMissingModal.show();
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  latitude = latitude.toString();
  console.log({ latitude });
  longitude = position.coords.longitude;
  longitude = longitude.toString();
  console.log({ longitude });

  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      y.innerHTML = "User denied the request for Geolocation.";
      geolocMissingModal.show();
      break;
    case error.POSITION_UNAVAILABLE:
      y.innerHTML = "Location information is unavailable.";
      geolocMissingModal.show();
      break;
    case error.TIMEOUT:
      y.innerHTML = "The request to get user location timed out.";
      geolocMissingModal.show();
      break;
    case error.UNKNOWN_ERROR:
      y.innerHTML = "An unknown error occurred.";
      geolocMissingModal.show();
      break;
  }
}

/* 
Goal:
 1.Save favorates to local storage
 2. conditional so that the user knows that its a favorite
 3. be able to manage favorites eg. be able to delete item or delete all items
*/

function toggleSaveToFav(cardId) {
  console.log({ cardId });

  var saveToFavBtn = document.getElementById(`${cardId}-save-btn`);
  console.log({ saveToFavBtn });
  saveToFavBtn.addEventListener("click", function () {
    saveToFavBtn.style.setProperty("display", "none");
  });

  var unSaveToFavBtn = document.getElementById(`${cardId}-unsave-btn`);
  console.log({ unSaveToFavBtn });
  unSaveToFavBtn.addEventListener("click", function () {
    unSaveToFavBtn.style.setProperty("display", "none");
  });
}

console.log();

// Geomodal Instruction

var videoBtn = document.querySelector(".video-btn");
var videoModal = document.getElementById("videoModal");
var video = document.getElementById("video");
var videoSrc;

videoBtn.addEventListener("click", function (e) {
  videoSrc = videoBtn.getAttribute("data-bs-src");
});

videoModal.addEventListener("shown.bs.modal", (e) => {
  video.setAttribute(
    "src",
    videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
  );
});

videoModal.addEventListener("hide.bs.modal", (e) => {
  video.setAttribute("src", videoSrc);
});

/*
Goal:
1. save the fuel,raduis and ranking to local storage
2. have a button "save settings", which will auto fill filter fields
*/
function saveHistory() {
  // form values for local storage
  var saveFilter = {
    // savedlat: Number(latitude),
    // savedlng: Number(longitude),
    savedfuelType: fuelOptionEle.options[fuelOptionEle.selectedIndex].value,
    savedradius: radiusOptionEle.options[radiusOptionEle.selectedIndex].value,
    savedsortByWhat:
      rankingOptionEle.options[rankingOptionEle.selectedIndex].value,
  };

  var checkbox = document.getElementById("saved-setting").checked;

  function storeRecentSearch() {


      localStorage.setItem("recentSearch", JSON.stringify(saveFilter));


  }


  func
  storeRecentSearch();
}

// 

// $(window).load(function () {
//     var strRemeberSearchData = localStorage.getItem('fuelcheckRemeberSearchData');
//     if (strRemeberSearchData !== null) {
//         var remeberSearchData = JSON.parse(strRemeberSearchData);

//         //for suburb
//         var savedSuburb = remeberSearchData.savedSuburb;
//         var savedPostCode = remeberSearchData.savedPostCode;
//         var savedSuburbName = remeberSearchData.savedSuburbName;
//         var savedLat = remeberSearchData.savedLat;
//         var savedLng = remeberSearchData.savedLng;
//         $('#txtbxSuburbPostCode').val(savedSuburb).attr('data-latitude', savedLat).attr('data-longitude', savedLng).attr('data-suburb', savedSuburbName).attr('data-postcode', savedPostCode);

//         //for checkbox
//         $('#SavedSettingsChecked').attr('checked', 'checked');
// }
// });

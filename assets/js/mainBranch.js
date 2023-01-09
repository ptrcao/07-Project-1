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
      title: property.name + ", Price: " + property.location.distance,
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

var namedLocation = "Some location";

var latitude;
var longitude;

// If referenceNode is the last child within its parent element, that's fine, because referenceNode.nextSibling will be null and insertBefore handles that case by adding to the end of the list.
// https://stackoverflow.com/a/4793630/9095603

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

/* Sarah's code */

// document.addEventListener("DOMContentLoaded", () => {
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
      "https://cors-anywhere.herokuapp.com/https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          authorization: auth,
        },
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
      "https://cors-anywhere.herokuapp.com/https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
      {
        headers: {
          accept: "application/json",
          apikey: apikey,
          authorization: `Bearer ${credentials}`,
          // "cache-control": "max-age=0",
          "content-type": "application/json; charset=utf-8",
          "if-modified-since": "25/12/2022 05:00:00 AM",
          requesttimestamp: "25/12/2022 05:00:00 AM",
          transactionid: "5",
        },
        method: "GET",
      }
    );

    // console.log({response});
    let data = await response.json();

    // Add fuel types for form
    var fuelTypes = data.fueltypes;

    // console.log({ fuelTypes });

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
        // https://www.javascripttutorial.net/javascript-dom/javascript-add-remove-options/
        // https://stackoverflow.com/a/73725875/9095603
      }
    }

    // Add fuel brands - you will use all of them automatically in the search
    // Brands should be dynamic, as in theory new brands could be added and old ones phased out
    var fuelBrands = data.brands.items;
    // console.table(fuelBrands);

    brandsArray = [];
    for (let i = 0; i < fuelBrands.length; ++i) {
      brandsArray.push(fuelBrands[i].name);
    }

    // console.log({ brandsArray });

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
      // console.log(fuelType);
      fuelTypeInnerText =
        fuelOptionEle.options[fuelOptionEle.selectedIndex].innerText;
      console.log(fuelTypeInnerText);
      radius = radiusOptionEle.options[radiusOptionEle.selectedIndex].value;
      // console.log(radius);

      if (radius) {
        radiusM = radius * 1000;
      }

      sortByWhat =
        rankingOptionEle.options[rankingOptionEle.selectedIndex].value;
      // console.log(sortByWhat);

      // saveHistory();
      // Add missing inputs modal
      // if (!fuelType || !radius || !sortByWhat) {
      if (!fuelType || !radius || !sortByWhat) {
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

      // end braces for if(!latitude || !longitude){
    }
  });
}

async function addEventListenerToEVFuelOption() {
  document
    .querySelector("#fuel-select")
    .addEventListener("change", function () {
      if (this.value == "EV") {
        console.log("EV selected");
        document
          .querySelector("#ranking-select option[value='Price']")
          .setAttribute("disabled", "");
        document.querySelector("#price-disable-EV").style.display = "inline";
        document.querySelector("#no-price-warning-EV").style.display = "inline";
      } else if (this.value != "EV") {
        console.log("NOT EV selected");
        document
          .querySelector("#ranking-select option[value='Price']")
          .removeAttribute("disabled", "");
        // If the attribute is present at all, regardless of the value, its value is considered to be true.
        // If a boolean attribute is not present, the value of the attribute is considered to be false.
        // If you need to remove an attribute, use the removeAttribute method.
        // https://bobbyhadz.com/blog/javascript-set-attribute-disabled#:~:text=Set%20the%20disabled%20Attribute%20using%20JavaScript%20%23%20To,will%20add%20the%20disabled%20attribute%20to%20the%20element.
        document.querySelector("#price-disable-EV").style.display = "none";
        document.querySelector("#no-price-warning-EV").style.display = "none";
      }
    });
}

async function displayResult(main_array) {
  // console.log({ main_array });
  // console.log({ resultsContainer });

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

  /* work in progress on sticky bar */
  var topStickyBar = document.createElement("div");
  var resultsCountEle = document.createElement("h2");

  topStickyBar.setAttribute("id", "navbar");
  // topStickyBar.innerHTML = 'this is sticky bar';
  topStickyBar.classList.add("fixed-bottom", "text-center");

  var body = document.getElementsByTagName("body")[0];

  // existingNode.parentNode.insertBefore(newNode, existingNode);
  // resultsContainer.parentNode.insertBefore(topStickyBar, resultsContainer);

  // body.prepend(topStickyBar);
  // body.append(topStickyBar);
  var footer = document.getElementsByTagName("footer")[0];

  footer.parentNode.insertBefore(topStickyBar, footer.nextSibling);

  var topStickyBarCreated = document.getElementById("navbar");

  const searchAgainBtn = document.createElement("button");
  searchAgainBtn.innerHTML = "Search again";
  searchAgainBtn.setAttribute("type", "submit");
  searchAgainBtn.setAttribute("id", "search-again-btn");
  searchAgainBtn.classList.add("text-center", "btn-dark", "btn-lg", "m-2");

  searchAgainBtn.setAttribute("onClick", "window.location.reload();");

  topStickyBarCreated.appendChild(searchAgainBtn);

  var searchAgainMsg = document.createElement("span");
  searchAgainMsg.setAttribute("id", "search-again-msg");
  searchAgainMsg.innerHTML =
    "Don't like your results? Try again with different search parameters:";

  topStickyBarCreated.insertBefore(searchAgainMsg, searchAgainBtn);

  // FIX STICKY OVERLAP, otherwise footer will be covered
  // For full responsive solution you would need either javascript, or flex, but 100px works for the worst case scenario, so it works

  footer.classList.remove("pb-3");
  footer.style.paddingBottom = "100px";

  // be careful to ensure this limit is limiting to the TOP 10 results and not to the BOTTOM 10
  if (main_array.stations.length > 10) {
    countOfReturnedResults = 10;
    resultsCountEle.innerHTML = `<span class='search-terms'>${fuelTypeInnerText}</span> within <span class='search-terms'>${radius}</span>km, sorted by <span class='search-terms'>${sortByCode}</span>: 10 results returned (actually ${main_array.stations.length} found, but limited to best 10).<br><small>Scroll further down for stations specifics.</small>`;
  } else if (
    main_array.stations.length > 0 &&
    main_array.stations.length <= 10
  ) {
    countOfReturnedResults = main_array.stations.length;
    resultsCountEle.innerHTML = `<span class='search-terms'>${fuelTypeInnerText}</span> within <span class='search-terms'>${radius}</span>km, sorted by <span class='search-terms'>${sortByCode}</span>: ${main_array.stations.length} results found.<br><small>Scroll further down for stations specifics.</small>`;
  } else if (main_array.stations.length <= 0) {
    countOfReturnedResults = 0;
    resultsCountEle.innerHTML = `<span class='search-terms'>${fuelTypeInnerText}</span> within <span class='search-terms'>${radius}</span>km, sorted by <span class='search-terms'>${sortByCode}</span>: No results found. Try broadening your search parameters.`;
    // unlike the conditions above, the append elements are required here because the program will now exit
    resultsContainer.appendChild(resultsCountEle);
    appendSearchAgainButton();
    return;
  }

  resultsContainer.appendChild(resultsCountEle);

  // var bigMapContainer = document.createElement("div");
  // bigMapContainer.setAttribute("class","row")

  var bigMap = document.createElement("div");
  // bigMap.setAttribute("src", "assets/images/example-big-map.png");
  // bigMap.setAttribute("alt", "Summary map");
  bigMap.setAttribute("id", "map");
  bigMap.classList.add("img-fluid", "card", "mb-3");
  // resultsContainer.appendChild(bigMapContainer);
  // bigMapContainer.appendChild(bigMap)

  resultsContainer.appendChild(bigMap);

  /* BIG MAP GOES HERE */

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

    // console.table(main_array.prices);

    var indexOfInterest = main_array.prices.findIndex((sub) => {
      // console.log({current_code})
      // console.log({sub})
      // console.log(sub['stationcode'])

      // return sub.indexOf(number) !== -1;
      return sub["stationcode"] == current_code;

      // return sub.indexOf(
      //   sub.stationcode == current_code
      //   ) !== -1;
      // The indexOf() method returns -1 if the value is not found.
      // https://www.w3schools.com/jsref/jsref_indexof_array.asp
    });

    // console.log(indexOfInterest);

    // Get price for corresponding
    var the_price = main_array.prices[indexOfInterest].price;
    var lastUpdated = main_array.prices[indexOfInterest].lastupdated;
    // console.log({ the_price });
    // console.log({ lastUpdated });

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
  // stickPanelBottom.classList.add("text-center", "btn-dark", "btn-lg");
  document.body.appendChild(stickPanelBottom);

  const searchAgainBtn = document.createElement("button");
  searchAgainBtn.innerHTML = "Search again";
  searchAgainBtn.setAttribute("type", "submit");
  searchAgainBtn.setAttribute("id", "search-again-btn");
  searchAgainBtn.classList.add("text-center", "btn-dark", "btn-lg");

  searchAgainBtn.setAttribute("onClick", "window.location.reload();");

  // topStickyBar.appendChild(searchAgainBtn);
}

async function runSearch() {
  var searchPanel = document.getElementById("search-parent-container");
  searchPanel.style.setProperty("display", "none");

  loadingOverlayOn();

  try {
    let response = await fetch(
      // if needed https://cors-anywhere.herokuapp.com/
      // then, if needed go to https://cors-anywhere.herokuapp.com/corsdemo and click to get server permissions
      "https://cors-anywhere.herokuapp.com/https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby",
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

    runSearch();
    await displayResult(data);
    await generateSmallMaps(data);
    loadingOverlayOff();
  } catch (err) {
    console.log(err);
  }
}

async function runApp() {
  loadingOverlayOn();

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

  await Promise.all([
    populateForm(credentials),
    attachListenerToButton(),
    addEventListenerToEVFuelOption(),
  ]);
  // https://stackoverflow.com/a/35612484/9095603

  loadingOverlayOff();
}

runApp();
// });

async function generateSmallMaps(main_array) {
  /* TODO 
https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=8&size=400x400&key=AIzaSyAe5ZUE7_aAt_XBV7JwtjNH8Yt6piWzNhg
*/

  fuelRequest = main_array;
  // console.log({ fuelRequest });

  //console.log(fuelRequest.stations[0].location.latitude);
  //console.log(fuelRequest.stations[0].location.longitude);

  /*for loop searching for each map, to run on this page being loaded */
  /* only top 5 stations */

  // var mapList = document.getElementsByClassName("map");
  // console.log(mapList);
  // var maxStations = 4;

  // for (var i = 0; i < mapList.length; i++) {
  for (var i = 0; i < countOfReturnedResults; i++) {
    // console.log({ mapList });
    // console.log("maplist length: " + mapList.length);
    // console.log(fuelRequest.stations[i].location.latitude);
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

  /*
var orig = {lat: 40.71303542062185, lng: -74.00801175633978} // user location ;
var dest = {lat: 40.71580432662713, lng: -73.99684223456448}  // petrol station ;
*/
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
      // console.log(response);
      // console.log(response.routes[0].legs[0].start_location);
      // console.log(status);
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
  // console.log({latitude})
  longitude = position.coords.longitude;
  longitude = longitude.toString();
  // console.log({longitude})

  x.innerHTML = `<p><em><i class="fa-solid fa-location-crosshairs"></i> Your location detected as { Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude} }</em></p>`;
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

// console.log(runSearch(data))

function toggleSaveToFav(cardId) {
  console.log("Its the card id" + { cardId });

  var saveFav = `${cardId}`;

  var saveToFavBtn = document.getElementById(`${cardId}-save-btn`);
  console.log({ saveToFavBtn });
  saveToFavBtn.addEventListener("click", function () {
    saveToFavBtn.style.setProperty("display", "none");

    localStorage.setItem("favorites", JSON.stringify(displayResult(saveFav)));
  });

  var unSaveToFavBtn = document.getElementById(`${cardId}-unsave-btn`);
  console.log({ unSaveToFavBtn });
  unSaveToFavBtn.addEventListener("click", function () {
    unSaveToFavBtn.style.setProperty("display", "none");
  });
}

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

// History

function saveHistory() {
  
  var savedFilter = {
    savedlat: Number(latitude),
    savedlng: Number(longitude),
    savedfuelType: fuelOptionEle.value,
    savedradius: radiusOptionEle.value,
    savedsortByWhat: rankingOptionEle.value,
  };

  localStorage.setItem("AutoFill", JSON.stringify(savedFilter));
}

document.getElementById("autoFill-btn").addEventListener("click", function (e) {
  e.preventDefault();

  // var savedFilter = JSON.parse(localStorage.getItem("AutoFill"));

  var fill = localStorage.getItem("AutoFill");
if (fill !== null) {

  var savedFilter = JSON.parse(fill);

  latitude = `${savedFilter.savedlat}`;
  longitude = `${savedFilter.savedlng}`;
  fuelType= `${savedFilter.savedfuelType}`
  fuelOptionEle.innerHTML = fuelType
  radius = `${savedFilter.savedradius}`
  radiusOptionEle.innerHTML = radius
  sortByWhat = `${savedFilter.savedsortByWhat}`
  rankingOptionEle.innerHTML = sortByWhat

}

runSearch();

});


/* Function that list History

function saveHistory() {

  var timeSaved = new Date();
  var time = timeSaved.toLocaleTimeString("en-US");

  var savedFilter = {
    timeSaved: time,
    savedfuelType: fuelOptionEle.value,
    savedradius: radiusOptionEle.value,
    savedsortByWhat: rankingOptionEle.value,
  };

  function storeNewSearch() {

    if (localStorage.getItem("recent-searches") == null) {
      localStorage.setItem("recent-searches", "[]");
    }

    var savedSearch = JSON.parse(localStorage.getItem("recent-searches"));
    console.log(savedSearch);

    savedSearch.push(savedFilter);

    localStorage.setItem("recent-searches", JSON.stringify(savedSearch));

    var historyCardLi = document.getElementById("historyDiv");
    var searchGroup = document.createElement("div");
    searchGroup.classList.add("list-group");
    historyCardLi.append(searchGroup);

    for (var i = 0; i < savedSearch.length; i++) {
      var recent = savedSearch[i];

      console.log(recent);

      var searchLi = document.createElement("button");
      searchLi.classList.add("list-group-item");
      searchLi.innerHTML = `time : ${recent.timeSaved} , fueltype : ${recent.savedfuelType}, raduis : ${recent.savedradius}, sortBy: ${recent.savedsortByWhat}`;
      searchGroup.appendChild(searchLi);

      searchLi.addEventListener("click", function (e) {
        e.preventDefault();

        console.log(recent)

      fuelCode = `${recent.savedfuelType}`
      console.log(fuelCode)
      radiusM = `${recent.savedradius}`
      console.log(radiusM)
      rank = `${recent.savedsortByWhat}`
      console.log(rank)

runSearch();

      })

    }
  }

  storeNewSearch();
}

*/
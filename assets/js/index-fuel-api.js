var credentials;
var fuelName;
var sortByCode;
var sortByName;
var fuelCode;
var rank;

document.addEventListener("DOMContentLoaded", (event) => {
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
          // "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          // apikey: "1MYSRAx5yvqHUZc6VGtxix6oMA2qgfRT",
          apikey: apikey,
          authorization: `Bearer ${credentials}`,
          // "cache-control": "max-age=0",
          "content-type": "application/json; charset=utf-8",
          "if-modified-since": "25/12/2022 05:00:00 AM",
          requesttimestamp: "25/12/2022 05:00:00 AM",
          // "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
          // "sec-ch-ua-mobile": "?0",
          // "sec-ch-ua-platform": "\"Windows\"",
          // "sec-fetch-dest": "empty",
          // "sec-fetch-mode": "cors",
          // "sec-fetch-site": "same-site",
          transactionid: "5",
        },
        // "referrerPolicy": "no-referrer",
        // "body": null,
        method: "GET",
        // "mode": "cors",
        // "credentials": "include"
      }
    );

    console.log("check line 295: " + response);
    let data = await response.json();
    // IF YOU DO
    // .then((response) => {
    // response.json()
    // })
    // with the curly braces, it will return undefined

    // Add fuel types for form
    var fuelTypes = data.fueltypes;
    console.log({ fuelTypes });

    for (let i = 0; i < fuelTypes.items.length; ++i) {
      fuelName = fuelTypes.items[i].name;
      fuelCode = fuelTypes.items[i].code;
      console.log({ fuelName });
      console.log({ fuelCode });

      fuelSelect.add(new Option(fuelName, fuelCode));
      // https://www.javascripttutorial.net/javascript-dom/javascript-add-remove-options/
      // https://stackoverflow.com/a/73725875/9095603
    }

    // Add fuel brands - you will use all of them automatically in the search
    // Brands should be dynamic, as in theory new brands could be added and old ones phased out
    var fuelBrands = data.brands.items;
    console.table(fuelBrands);

    brandsArray = [];
    for (let i = 0; i < fuelBrands.length; ++i) {
      brandsArray.push(fuelBrands[i].name);
    }

    console.log({ brandsArray });

    // Dynamically get sort-by fields

    for (let i = 0; i < data.sortfields.items.length; ++i) {
      sortByCode = data.sortfields.items[i].code;
      sortByName = data.sortfields.items[i].name;
      console.log({ sortByCode });
      console.log({ sortByName });

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

    // Fire modal if geolocation unavailable
    if (!latitude || !longitude) {
      geolocMissingModal.show();
    } else {
      // document.getElementsByClassName("spinner-grow")[0].style.setProperty("display","block");

      fuelType = fuelOptionEle.options[fuelOptionEle.selectedIndex].value;
      console.log(fuelType);

      radius = radiusOptionEle.options[radiusOptionEle.selectedIndex].value;
      console.log(radius);
      if (!radius) {
        // if no selection is made
        // then set the value of radius to empty
        radius = "";
        // and automatically select unlimited dropdown option for the user
        radiusOptionEle.value = "unlimited";
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

      // end braces for if(!latitude || !longitude){
    }
  });
}

async function displayResult(main_array) {
  console.log({ main_array });
  console.log({ resultsContainer });

  var resultsCount = main_array.stations.length;
  var resultsCountEle = document.createElement("div");
  resultsCountEle.innerText = `${resultsCount} results found:`;
  resultsContainer.appendChild(resultsCountEle);

  var bigMap = document.createElement("img");
  bigMap.setAttribute("src", "assets/images/example-big-map.png");
  bigMap.setAttribute("alt", "Summary map");
  resultsContainer.appendChild(bigMap);

  var newArray = [];
  var current_code;
  // for (var i = 0; i < main_array.stations.length; i++) {
  for (var i = 0; i < main_array.stations.length; i++) {
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

    console.log(indexOfInterest);

    // Get price for corresponding
    var the_price = main_array.prices[indexOfInterest].price;
    console.log({ the_price });

    let resultsSlot = document.createElement("div");
    resultsSlot.setAttribute("class", `station-index-${indexOfInterest}`);
    resultsContainer.appendChild(resultsSlot);

    rank = i + 1;

    resultsSlot.innerHTML = `




<div id="${main_array.stations[i].code}" class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        
        <h5>Rank #${rank} by ${sortByWhat}</h5>
        <h3>${main_array.stations[i].name}</h3>

        <div style="padding:4px;">${the_price} cents/Litre</div><div style="padding:4px;">${main_array.stations[i].location.distance} km</div>

        <p class="card-text">
                
        <table>
        <tbody>
        <tr><th>Station code:</th><td>${main_array.stations[i].code}</td></tr>
        <tr><th>Street Address:</th><td>${main_array.stations[i].address}</td></tr>
        <tr><th>Longitude:</th><td>${main_array.stations[i].location.latitude}</td></tr>
        <tr><th>Latitude:</th><td>${main_array.stations[i].location.longitude}</td></tr>
        </tbody>
        </table>

        </p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
`;

    // Limit the number of results returned
    // Warn the user when no results inside radius; in that case, the 10 next closest will be returned by the API
    // if (main_array.stations[i].location.distance > 10) {
    //   console.log("Outside of 10km");
    // }

    // if (main_array.stations[i].location.distance <= radius) {
    // }
  }

  // Append search again button at end
  const searchAgainBtn = document.createElement("button");
  searchAgainBtn.innerHTML = "Search again";
  searchAgainBtn.setAttribute("type", "submit");
  searchAgainBtn.setAttribute("id", "search-again-btn");
  resultsContainer.appendChild(searchAgainBtn);
}

async function runSearch() {

  var searchPanel = document.getElementById("search-parent-container")
  searchPanel.style.setProperty("display","none")

  loadingOverlayOn();
  try {
    // During testing, I'm just going to use the previously retrieved in storage to avoid burning through credits
    // if (!localStorage.getItem("serializedResponse")) {
    // fetch(
    //   "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
    //   {
    //     headers: {
    //       accept: "application/json",
    //       authorization:
    //         // "Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==",
    //         auth,
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    //   // .then( data => {accessToken = data.access_token; console.log(accessToken)} ))
    //   .then((data) =>
    let response = await fetch(
      // if needed https://cors-anywhere.herokuapp.com/
      // then, if needed go to https://cors-anywhere.herokuapp.com/corsdemo and click to get server permissions
      "https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby",
      {
        headers: {
          // apikey: "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4",
          apikey: apikey,
          authorization: `Bearer ${globalAccessToken}`,
          "content-type": "application/json",
          requesttimestamp: "28/12/2022 01:30:00 PM",
          transactionid: "4",
        },
        // "body": "{\n  \"fueltype\": \"P95\",\n  \"brand\": [\n    \"BP\"\n  ],\n  \"namedlocation\": \"2065\",\n  \"latitude\": \"-33.4362551\",\n  \"longitude\": \"151.2966549\",\n  \"radius\": \"\",\n  \"sortby\": \"price\",\n  \"sortascending\": \"true\"\n}",
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
    // is .json the same as JSON.parse() ?

    // example of storage of an object in localStorage without serializing it first; it will appear as an undefined object
    // localStorage.setItem("finalResponse", response);
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
    loadingOverlayOff();
  } catch (error) {
    console.log(error);
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

  // []
  // 200 OK
  // if array.length < 1
  // DO something

  // .catch((error) => {
  //   console.log(error);
  // });

  // alternative to .then and .catch
  // async
  // await
}

async function runApp() {
  loadingOverlayOn();
  // isLoading = true;
  credentials = await getCredentials();
  console.log("credentials in runApp(): " + credentials);

  await Promise.all([populateForm(credentials), attachListenerToButton()]);
  // https://stackoverflow.com/a/35612484/9095603

  loadingOverlayOff();
  // isLoading = false;
}













  // var globalAccessToken = "QdGf3YaifPEzy9rbYpwwKvhFDm6o";
  var globalAccessToken;

  // TIP: you can literally edit and add data into the localStorage by hand, so you can paste data that I give you into local localStorage so you don't have to make the API calls
  // How would we figure out the structure of the API call without copying the fetch?

  // Get reference data
  // List out fuel types
  // Dynamically generate fuel list, since this list could theoretically change over time as new fuels become available or old ones are phased out for environmental reasons, for example

  // var tester =
  // {
  //   "refresh_token_expires_in" : "0",
  //   "api_product_list" : "[Fuel Check Portal Api FreeProductForPortal]",
  //   "api_product_list_json" : [ "Fuel Check Portal Api FreeProductForPortal" ],
  //   "organization_name" : "onegov",
  //   "developer.email" : "deptoffinancensw@gmail.com",
  //   "token_type" : "BearerToken",
  //   "issued_at" : "1671908949640",
  //   "client_id" : "1MYSRAx5yvqHUZc6VGtxix6oMA2qgfRT",
  //   "access_token" : "QPULWhh7faHPigBUS4bDDZprAD5f",
  //   "application_name" : "2a2f9f97-2157-42f2-854d-c606e89bc0fc",
  //   "scope" : "",
  //   "expires_in" : "43199",
  //   "refresh_count" : "0",
  //   "status" : "approved"
  // }
  // var mytest = tester.access_token
  // console.log({mytest})

  // debugger

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

  // Artificial selections
  // To test modal, comment out these 3:
  // var fuelType = "PDL";
  // var radius = "10";
  // var sortByWhat = "distance";

  var sortascending = "true";

  var fuelSelect = document.getElementById("fuel-select");
  // var fuelSelect = document.querySelector("#fuel-select")

  // Geolocation API

  var namedLocation = "Canterbury Leisure and Aquatic Centre";
  // I assume namedLocation can be whatever you want and does not have to be an actual postcode or something?

  var latitude = "-33.9104";
  var longitude = "151.1136";
  // var latitude;
  // var longitude;
  // 10km
  // [{long: -33.9104, long 151.1136}, {long: -33.9104, long 151.1136}, {long: -33.9104, long 151.1136}, {long: -33.9104, long 151.1136}, {long: -33.9104, long 151.1136}]

  // Fire modal if geolocation unavailable
  if (!latitude || !longitude) {
    geolocMissingModal.show();
  } else {
    // Display geoloc coordinates

    var h1HeadingEle = document.getElementById("main-h1");
    const geoCoordinates = document.createElement("div");
    geoCoordinates.innerHTML = `Your detected device geocoordinates are: latitude <span id="latitude">${latitude}</span>, longitude <span id="longitude">${longitude}</span>.`;
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

  runApp();
});


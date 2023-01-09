
// Define elements
var resultsContainer = document.getElementById("results-container");


//??
window.addEventListener("load", (event) => {
  document.getElementsByClassName("spinner-grow")[0].style.setProperty("display","none");
});

// Define modals
var inputMissingModal = new bootstrap.Modal(document.getElementById('input-missing-modal'))
var geolocMissingModal = new bootstrap.Modal(document.getElementById('geoloc-perms-err'))


// Using test API
var auth = "Basic MU1ZU1JBeDV5dnFIVVpjNlZHdHhpeDZvTUEycWdmUlQ6Qk12V2FjdzE1RXQ4dUZHRg==";
var apikey = "1MYSRAx5yvqHUZc6VGtxix6oMA2qgfRT";

// Using free registered API
// var auth = "Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==";
// var apikey = "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4";

var sortascending = "true";

var fuelSelect = document.getElementById("fuel-select");

// Geolocation API

var namedLocation = "2250";
// I assume namedLocation can be whatever you want and does not have to be an actual postcode or something?

var latitude = "33.4267";
var longitude = "151.3417";
// var latitude;
// var longitude;


// Fire modal if geolocation unavailable
if(!latitude || !longitude){
  geolocMissingModal.show();
}
else{
// Display geoloc coordinates

var h1HeadingEle = document.getElementById("main-h1")
const geoCoordinates = document.createElement("div")
geoCoordinates.innerHTML=`Your detected device geocoordinates are: latitude <span id="latitude">${latitude}</span>, longitude <span id="longitude">${longitude}</span>.`
h1HeadingEle.parentNode.insertBefore(geoCoordinates,h1HeadingEle.nextSibling)
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


document.getElementById("fetch").addEventListener("click", function (e) {
  e.preventDefault();

  // Fire modal if geolocation unavailable
  if(!latitude || !longitude){
    geolocMissingModal.show();
  }
  else{

  document.getElementsByClassName("spinner-grow")[0].style.setProperty("display","block");

  fuelType = fuelOptionEle.options[fuelOptionEle.selectedIndex].value;
  console.log(fuelType);
 
  radius = radiusOptionEle.options[radiusOptionEle.selectedIndex].value;
  console.log(radius);
  if(!radius){
    // if no selection is made
    // then set the value of radius to empty
    radius=""
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
    missingArray = [];

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
      liNode = document.createElement("li");
      txtNode = document.createTextNode(`${missingArray[i]}`);
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
    inputMissingModal.show()
  } else {
    runSearch();
  }

  // end braces for if(!latitude || !longitude){
  }

});




// You want to run the fetch to get the brands (full range is assumed for search) and fuelType (options) from the get go

fetch(
  "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
  {
    headers: {
      accept: "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      authorization: auth,
    },
    method: "GET",
  }
)
  .then((response) => response.json())
  .then((data) =>
    fetch(
      "https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
      {
        headers: {
          accept: "application/json",
          apikey: apikey,
          authorization: `Bearer ${data.access_token}`,
          "content-type": "application/json; charset=utf-8",
          "if-modified-since": "25/12/2022 05:00:00 AM",
          requesttimestamp: "25/12/2022 05:00:00 AM",
          transactionid: "5",
        },
        method: "GET",
      }
    )
  )
  .then((response) => response.json())

  .then((data) => {
    // Add fuel types for form
    var fuelTypes = data.fueltypes;
    console.log({ fuelTypes });

    for (var i = 0; i < fuelTypes.items.length; ++i) {
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
    // console.table(fuelBrands);

    brandsArray = [];
    for (var i = 0; i < fuelBrands.length; ++i) {
      brandsArray.push(fuelBrands[i].name);
    }

    console.log({ brandsArray });

    // Dynamically get sort-by fields
    
    for (var i = 0; i < data.sortfields.items.length; ++i) {

      sortByCode = data.sortfields.items[i].code;
      sortByName = data.sortfields.items[i].name;
      console.log({ sortByCode });
      console.log({ sortByName });

      document.getElementById('ranking-select').add(new Option(sortByName, sortByCode));
    }
    
  // Dynamically display number of stations
    document.getElementById("station-count").innerText = data.stations.items.length;


  });



 

//================================================================================================================================


  function runSearch(){


    // During testing, I'm just going to use the previously retrieved in storage to avoid burning through credits
    if (!localStorage.getItem("serializedResponse")) {
      fetch(
        "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
        {
          headers: {
            accept: "application/json",
            authorization: auth,
          },
        }
      )
        .then((response) => response.json())
        // .then( data => {accessToken = data.access_token; console.log(accessToken)} ))
        .then((data) => 
          fetch(
            //if needed https://cors-anywhere.herokuapp.com/corsdemo
            "https://cors-anywhere.herokuapp.com/https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/location",
            // "https://cors-anywhere.herokuapp.com/https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby",
            {
              headers: {
                apikey: apikey,
                authorization: `Bearer ${data.access_token}`,
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
          )
        )
        .then((response) => response.json())
        // is .json the same as JSON.parse() ?
        .then((response) => {
          // example of storage of an object in localStorage without serializing it first; it will appear as an undefined object
          // localStorage.setItem("finalResponse", response);
          // Now if we stringify it, it should be in the correct format for localStorage
          localStorage.setItem("serializedResponse", JSON.stringify(response));

          displayResult(response);

        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Using localStorage data .........................");
      let myObj = localStorage.getItem("serializedResponse");
      console.log("Before JSON.parse(): ", myObj);
      console.table("Before JSON.parse(): ", myObj);

      // console.log("After JSON.parse(): ", myObj.stations);
      // console.table("After JSON.parse(): ", myObj.stations);

      let myObjDeserialized = JSON.parse(
        localStorage.getItem("serializedResponse")
      );
      console.log("After JSON.parse(): ", myObjDeserialized);
      console.table("After JSON.parse(): ", myObjDeserialized);

      console.log("After JSON.parse(): ", myObjDeserialized.stations);
      console.table("After JSON.parse(): ", myObjDeserialized.stations);

      console.log(myObjDeserialized.prices);
      console.table(myObjDeserialized.prices);
      console.log(myObjDeserialized.stations);
      console.table(myObjDeserialized.stations);
      console.log(myObjDeserialized.stations.location);
      console.table(myObjDeserialized.stations.location);

      console.log("Working ....................................................................");
      for (var i = 0; i < myObjDeserialized.stations.length; i++) {
        console.log(myObjDeserialized.stations[i].location);
        console.table(myObjDeserialized.stations[i].location);
      }

      displayResult(myObjDeserialized);

    }
  }



function displayResult(main_array){

  // Hide form field
  // document.getElementsByClassName("input-field").style.display = "none";

  console.log({main_array})
  console.log({resultsContainer})


  var resultsCount = main_array.stations.length;
  var resultsCountEle = document.createElement("div")
  resultsCountEle.innerText = `${resultsCount} results found:`
  resultsContainer.appendChild(resultsCountEle)
  
 

  newArray = [];
  var current_code;
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
<div class="card">
<img style="max-width:400px; height:auto" class="card-img-top" src="assets/images/example-small-map.PNG" alt="Card image cap">

<div class="card-body">
<div class="card-header">
<h5>Rank #${rank} by ${sortByWhat}</h5>
<h3>${main_array.stations[i].name}</h3>
</div>

<div style="padding:4px;">${the_price} cents/Litre</div><div style="padding:4px;">${main_array.stations[i].location.distance} km</div>

<table>
<tbody>
<tr><th>Station code:</th><td>${main_array.stations[i].code}</td></tr>
<tr><th>Street Address:</th><td>${main_array.stations[i].address}</td></tr>
<tr><th>Longitude:</th><td>${main_array.stations[i].location.latitude}</td></tr>
<tr><th>Latitude:</th><td>${main_array.stations[i].location.longitude}</td></tr>
</tbody>
</table>

</div>

</div>
`;

// Limit the number of results returned
// Warn the user when no results inside radius; in that case, the 10 next closest will be returned by the API
    if (main_array.stations[i].location.distance > 10) {
      console.log("Outside of 10km");
    }

    if (main_array.stations[i].location.distance <= radius) {
    }
  }




// Append search again button at end
  const searchAgainBtn = document.createElement("button")
searchAgainBtn.innerHTML = "Search Again";
searchAgainBtn.setAttribute("type","submit")
searchAgainBtn.setAttribute("class","glyphicon glyphicon-search")
resultsContainer.appendChild(searchAgainBtn)

function searchAgain() {
if (searchAgainBtn) {
  window.location.reload()
}
else {
  runSearch();
}
}

searchAgainBtn.addEventListener('click',searchAgain);

};



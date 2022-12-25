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


var fuelSelect = document.getElementById("fuel-select")
// var fuelSelect = document.querySelector("#fuel-select")

fetch("https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "authorization": "Basic MU1ZU1JBeDV5dnFIVVpjNlZHdHhpeDZvTUEycWdmUlQ6Qk12V2FjdzE1RXQ4dUZHRg==",
  },
  "referrerPolicy": "no-referrer",
  "body": null,
  "method": "GET",
})
  .then((response) => 
    
  //  var test = response.json();

  //  console.log({ test })

  response.json()
   
  )
  .then((data) => 
 
    fetch(
      "https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
      {
        headers: {
          accept: "application/json",
          // "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          apikey: "1MYSRAx5yvqHUZc6VGtxix6oMA2qgfRT",
          authorization: `Bearer ${data.access_token}`,
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
    )
    
  )
  .then((response) => 
    response.json()
  )
// IF YOU DO
// .then((response) => {
// response.json()
// })
// with the curly braces, it will return undefined

  .then((data) => {
    var fuelTypes = data.fueltypes;
    console.log({ fuelTypes });
    for(var i = 0; i < fuelTypes.items.length; ++i){

      fuelName = fuelTypes.items[i].name
      fuelCode = fuelTypes.items[i].code
      console.log({fuelName})
      console.log({fuelCode})

      fuelSelect.add(new Option(fuelName, fuelCode))
      // https://www.javascripttutorial.net/javascript-dom/javascript-add-remove-options/
      // https://stackoverflow.com/a/73725875/9095603
 
      

    }
  });

// Get form inputs
document.getElementById("advance-search");

console.log("hello");

var accessToken = "";
var fuelType = "PDL";
// We will use all brands
var brand = [
  "7-Eleven",
  "Ampol",
  "BP",
  "Budget",
  "Caltex",
  "Caltex Woolworths",
  "ChargePoint",
  "Chargefox",
  "Coles Express",
  "Costco",
  "EG Ampol",
  "EVUp",
  "Enhance",
  "Everty",
  "Evie Networks",
  "Independent",
  "Independent EV",
  "Inland Petroleum",
  "Liberty",
  "Lowes",
  "Metro Fuel",
  "Mobil",
  "NRMA",
  "Puma Energy",
  "Shell",
  "South West",
  "Speedway",
  "Tesla",
  "Transwest Fuels",
  "United",
  "Westside",
  "Woodham Petroleum",
];
// I assume namedLocation can be whatever you want and does not have to be an actual postcode or something?
var namedLocation = "Canterbury Leisure and Aquatic Centre";
var latitude = "-33.9104";
var longitude = "151.1136";
var radius = "10";
// radius = radius.toString();
var sortByWhat = "distance";
var sortascending = "true";

// During testing, I'm just going to use the previously retrieved in storage to avoid burning through credits
if (!JSON.parse(localStorage.getItem("serializedResponse"))) {
  fetch(
    "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
    {
      headers: {
        accept: "application/json",
        authorization:
          "Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==",
      },
    }
  )
    .then((response) => response.json())
    // .then( data => {accessToken = data.access_token; console.log(accessToken)} ))
    .then((data) =>
      fetch(
        "https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby",
        {
          headers: {
            apikey: "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4",
            authorization: `Bearer ${data.access_token}`,
            "content-type": "application/json",
            requesttimestamp: "20/12/2022 08:00:00 PM",
            transactionid: "4",
          },
          // "body": "{\n  \"fueltype\": \"P95\",\n  \"brand\": [\n    \"BP\"\n  ],\n  \"namedlocation\": \"2065\",\n  \"latitude\": \"-33.4362551\",\n  \"longitude\": \"151.2966549\",\n  \"radius\": \"\",\n  \"sortby\": \"price\",\n  \"sortascending\": \"true\"\n}",
          body: JSON.stringify({
            fueltype: fuelType,
            brand: brand,
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
      localStorage.setItem("finalResponse", response);
      // Now if we stringify it, it should be in the correct format for localStorage
      localStorage.setItem("serializedResponse", JSON.stringify(response));

      // retrieving the serializedResponse
      var myObj = localStorage.getItem("serializedResponse");
      console.log("Before JSON.parse(): ", myObj);
      console.table("Before JSON.parse(): ", myObj);

      let myObjDeserialized = JSON.parse(
        localStorage.getItem("serializedResponse")
      );
      console.log("After JSON.parse(): ", myObjDeserialized);
      console.table("After JSON.parse(): ", myObjDeserialized);

      console.log(myObjDeserialized);
      console.table(myObjDeserialized);
      console.log(myObjDeserialized.stations[0].location.distance);
      console.table(myObjDeserialized.stations[0].location.distance);

      console.log(myObjDeserialized.prices);
      console.table(myObjDeserialized.prices);
      console.log(myObjDeserialized.stations[7].stationid);
      console.table(myObjDeserialized.stations[7].stationid);

      console.log(myObjDeserialized.prices[3].price);
      console.table(myObjDeserialized.prices[3].price);
    });
} else {
  console.log("Using localStorage data");
  let myObj = localStorage.getItem("serializedResponse");
  console.log("Before JSON.parse(): ", myObj);
  console.table("Before JSON.parse(): ", myObj);

  console.log("After JSON.parse(): ", myObj.stations);
  console.table("After JSON.parse(): ", myObj.stations);

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

  console.log("Yo");
  for (var i = 0; i < myObjDeserialized.stations.length; i++) {
    console.log(myObjDeserialized.stations[i].location);
    console.table(myObjDeserialized.stations[i].location);
  }

  newArray = [];
  var current_code;
  for (var i = 0; i < myObjDeserialized.stations.length; i++) {
    console.log(myObjDeserialized.stations[i].location.distance);

    current_code = myObjDeserialized.stations[i].code;
    console.log({ current_code });
    // var price_array =

    console.log(myObjDeserialized.stations[i].code);
    console.log(myObjDeserialized.stations[i].name);
    console.log(myObjDeserialized.stations[i].address);
    console.log(myObjDeserialized.stations[i].location.latitude);
    console.log(myObjDeserialized.stations[i].location.longitude);

    // var indexOfInterest = myObjDeserialized.prices.findIndex(
    //   function(sub) {

    //     return sub.indexOf(
    //       function(blah){
    //         return blah.stationcode = current_stationid
    //         // https://stackoverflow.com/a/39810268/9095603
    //       }) !== -1;
    //     // The indexOf() method returns -1 if the value is not found.
    //     // https://www.w3schools.com/jsref/jsref_indexof_array.asp

    // });

    // myObjDeserialized.prices.forEach(element => {console.log(typeof element )});

    console.table(myObjDeserialized.prices);

    var indexOfInterest = myObjDeserialized.prices.findIndex((sub) => {
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
    var the_price = myObjDeserialized.prices[indexOfInterest].price;
    console.log({ the_price });

    var resultsContainer = document.getElementById("results-container");

    let resultsSlot = document.createElement("div");
    resultsSlot.setAttribute("class", `station-index-${indexOfInterest}`);
    resultsContainer.appendChild(resultsSlot);

    rank = i + 1;

    resultsSlot.innerHTML = `

<h4>Rank #${rank} by ${sortByWhat}</h4>
<h3>${myObjDeserialized.stations[i].name}</h3>
<div style="padding:4px;">${the_price} cents/Litre</div><div style="padding:4px;">${myObjDeserialized.stations[i].location.distance} km</div>
<table>
<tbody>
<tr><th>Station code:</th><td>${myObjDeserialized.stations[i].code}</td></tr>
<tr><th>Street Address:</th><td>${myObjDeserialized.stations[i].address}</td></tr>
<tr><th>Longitude:</th><td>${myObjDeserialized.stations[i].location.latitude}</td></tr>
<tr><th>Latitude:</th><td>${myObjDeserialized.stations[i].location.longitude}</td></tr>
</tbody>
</table>
`;
    /* <tr><th>Price cents/L</th><td><big>${the_price}</big></td></tr> */

    // I need to get the `array index`, for the `array element` of arr which has arr.prices[i][stationcode] = "1-3F7T60X"

    // function findByStationId(stationIdOfInterest) {
    //   return function(innerArr){
    //     return innerArr[0] === stationIdOfInterest
    //   }
    // }

    // myObjDeserialized.prices.findIndex( findByStationId(current_stationid) )

    // Get Index of Array Containing Value from Multi-dimensional Array in JS
    // https://stackoverflow.com/a/44210700/9095603

    // Find the index of a sub array that contains a number
    // https://stackoverflow.com/a/44553496/9095603

    //  console.log(indexOfRemainingArray);

    // newArray.push([])

    if (myObjDeserialized.stations[i].location.distance > 10) {
      console.log("Outside of 10km");
    }

    if (myObjDeserialized.stations[i].location.distance <= radius) {
    }
  }
}

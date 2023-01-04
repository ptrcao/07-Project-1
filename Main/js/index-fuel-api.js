console.log("hello")

// // var headers = new Headers({
// //     'Authorization': `Basic ${btoa(username + ':' + password)}`
// // });

// // fetch('https://host.com', {headers: headers})

// authorizationHeader = 'Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==';

// var headers = new Headers({
//     'accept' : 'application/json',
//     'Authorization' : authorizationHeader
// });

// var methods = 

// fetch("https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
// {'method' : 'GET'},
// headers
// )

var accessToken = '';

fetch("https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials", {
  "headers": {
    "accept": "application/json",
    // "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "authorization": "Basic ODhCWVYzdkNzNWtROWhuRWZqTVM2QzNDZ3hXNENyUjQ6TUtzYk9YNzdtNlA5dm1OSA==",
    // "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    // "sec-ch-ua-mobile": "?0",
    // "sec-ch-ua-platform": "\"Windows\"",
    // "sec-fetch-dest": "empty",
    // "sec-fetch-mode": "cors",
    // "sec-fetch-site": "same-site"
  },
//   "referrerPolicy": "no-referrer",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
})
.then(response => response.json())
// .then( data => {accessToken = data.access_token; console.log(accessToken)} ))
.then(
    data => 
fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby", {
  "headers": {

    "apikey": "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4",
    "authorization": `Bearer ${data.access_token}`,
    "content-type": "application/json",
    "requesttimestamp": "20/12/2022 08:00:00 PM",

    "transactionid": "4"
  },

  "body": "{\n  \"fueltype\": \"P95\",\n  \"brand\": [\n    \"BP\"\n  ],\n  \"namedlocation\": \"2065\",\n  \"latitude\": \"-33.4362551\",\n  \"longitude\": \"151.2966549\",\n  \"radius\": \"\",\n  \"sortby\": \"price\",\n  \"sortascending\": \"true\"\n}",
  "method": "POST",

})
)

// fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby", {
//   "headers": {
//     "accept": "application/json",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//     "apikey": "88BYV3vCs5kQ9hnEfjMS6C3CgxW4CrR4",
//     "authorization": "Bearer sIBzPPNf7bHjYGg54uv4u3j7OzgG",
//     "content-type": "application/json",
//     "requesttimestamp": "20/12/2022 08:00:00 PM",
//     "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "cross-site",
//     "transactionid": "4"
//   },
//   "referrer": "http://127.0.0.1:5504/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\n  \"fueltype\": \"P95\",\n  \"brand\": [\n    \"BP\"\n  ],\n  \"namedlocation\": \"2065\",\n  \"latitude\": \"-33.4362551\",\n  \"longitude\": \"151.2966549\",\n  \"radius\": \"\",\n  \"sortby\": \"price\",\n  \"sortascending\": \"true\"\n}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
















// fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices?states=NSW")
//     .then(response => {
//         console.log(response)
//     })
//     .catch(error => {
//         // handle the error
//     });

// Update 



// Fetches fuel price

// Fuel type
// Station ID
// Post code ***
// long 
// lat
// Fuel price
// fetch stations and prices within X km radius




// Geo location

// User's device location
// long
// lat
// postcode ***
// name of suburb
// name of city



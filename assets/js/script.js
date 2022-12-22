var checkBTN = document.querySelector("#check");

var accessToken = "";

function getAccessToken() {
  fetch(
    "https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials",
    {
      headers: {
        accept: "application/json",
        authorization:
          "Basic ODkwd2VhbUxVZWJUMTlqRFJBWGdBTWJoZVJjT2NRcHE6NERGN2RwUkw1Qlo4MERrMQ==",
      },
      referrerPolicy: "no-referrer",
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((response) => response.json())
    .then((data) => getPriceNearby(data));
  // .then( data => {accessToken = data.access_token; console.log(accessToken)} );
}

function getRefData() {
  fetch(
    "https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
    {
      headers: {
        accept: "application/json",
        apikey: "890weamLUebT19jDRAXgAMbheRcOcQpq",
        authorization: "Bearer GzR6lfpfZ7M4YAslUyVwCq58uGQe",
        "cache-control": "max-age=0",
        "content-type": "application/json; charset=utf-8",
        "if-modified-since": "15/12/2022 01:14:00 PM",
        requesttimestamp: "22/12/2022 01:14:00 PM",
        transactionid: "4",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
}

function getPriceNearby() {
  fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby", {
    headers: {
      accept: "application/json",
      apikey: "890weamLUebT19jDRAXgAMbheRcOcQpq",
      authorization: "Bearer ZyVqqkuxwGgO10iGmLzKwTKgJ5rl",
      "content-type": "application/json",
      requesttimestamp: "22/12/2022 01:04:00 PM",
      transactionid: "3",
    },
    body: '{\n  "fueltype": "P95",\n  "brand": [\n    "BP"\n  ],\n  "namedlocation": "2065",\n  "latitude": "-33.4362551",\n  "longitude": "151.2966549",\n  "radius": "",\n  "sortby": "price",\n  "sortascending": "true"\n}',
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

checkBTN.addEventListener("click", getAccessToken);

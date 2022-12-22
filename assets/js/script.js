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
    })
    .then(response => response.json())
    .then(
      data => 
  fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices/nearby", {
    "headers": {
  
      "apikey": "890weamLUebT19jDRAXgAMbheRcOcQpq",
      "authorization": `Bearer ${data.access_token}`,
      "content-type": "application/json",
      "requesttimestamp": "20/12/2022 08:00:00 PM",
      "transactionid": "1"
    },
  
    "body": "{\n  \"fueltype\": \"P95\",\n  \"brand\": [\n    \"BP\"\n  ],\n  \"namedlocation\": \"2065\",\n  \"latitude\": \"-33.4362551\",\n  \"longitude\": \"151.2966549\",\n  \"radius\": \"\",\n  \"sortby\": \"price\",\n  \"sortascending\": \"true\"\n}",
    "method": "POST",
  
  })
  )
  getRefData();
  // .then( data => {accessToken = data.access_token; console.log(accessToken)} );
};

function getRefData() {
  fetch(
    "https://api.onegov.nsw.gov.au/FuelCheckRefData/v2/fuel/lovs?states=NSW",
    {
      headers: {
        accept: "application/json",
        apikey: "890weamLUebT19jDRAXgAMbheRcOcQpq",
        authorization: `Bearer ${data.access_token}`,
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
};

checkBTN.addEventListener("click", getAccessToken);


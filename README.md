# Fuel Seeker NSW

<p style="background-color:yellow;font-weight:bold;">IMPORTANT: this project uses a CORS workaround.  You may need to go to https://cors-anywhere.herokuapp.com/corsdemo and click to request temporary access to the CORS proxy server that we use, in order to be able to view the website.  If there are any issues, please contact the authors.</p>

![This shows an additional step needed to view the website.](./assets/readme-assets/cors-anywhere-herokuapp-corsdemo.PNG)
IMPORTANT: the screenshot above depicts an additional step which may be required to view the deployed website.

> Repository URL:
> https://github.com/ptrcao/07-Project-1.git

> App URL:
> https://ptrcao.github.io/07-Project-1/




## Description

Fuel Seeker is an application that allows users to search for fuel nearby to their location. Users can search by Fuel Type and Radius (km), with ranking on either Price or Distance.
The projct uses two Third Party API's.
 - NSW Fuel API - a governement API which is used to get the nearby fuel prices across NSW.
 - Google Maps Javascript API - used to display both interactive and static maps that show the location of fuel stations and directions from the user's location. 

 This app was developed as finding cheap and accessible fuel is important to a lot of people and the existing web app alternatives presented consumers with information overload and analysis paralysis.  This app narrows down the relevant picks for motorists, and ranks them for their convenience and ease of decision-making.



## User Story

```
AS A motorist
I WANT to search for Fuel nearby
SO THAT I can find the cheapest or closest fuel to my current location
```

## Acceptance Criteria

```
GIVEN I want to search the API for Fuel nearby
WHEN I open the browser
THEN I am prompted to allow my location permissions
WHEN I block the request for location
THEN I am prompted with a modal that includes a link on how to enable location.
WHEN I select the Fuel Type, Radius and Sort by Distance options
THEN I am returned a maximum of 10 Fuel Stations ranked by Distance
WHEN I select the Fuel Type, Radius and Sort by Price Options
THEN I am returned a maximum of 10 Fuel Stations ranked by Price
WHEN I dont select Fuel Type, Radius and Sort by options
THEN I am prompted with a modal that tells me missing selections
WHEN I select electric vehicle (EV) charge as the fuel type,
THEN I am presented with a disclaimer about limited pricing information, and the Sort by Price option is disabled
WHEN I select Find Station button
THEN I am presented with a map that shows the 10 stations with a marker within the chosen radius, I am also presented with detailed results cards for each staion, including map directions visualised
WHEN I select find again button
THEN I am returned to the landing page.
WHEN I select auto fill based on last search button
THEN the input fields are auto-filled based on my last search
WHEN I select reset button
THEN the input fields are cleared

```


## Technology
- HTML
- CSS
- Javascript
- Bootstrap

- Fontawesome - https://fontawesome.com/
- Google fonts - https://developers.google.com/fonts

### APIs
- NSW Fuel API
- Google Maps Javascript API
- Geolocation

## Usage

The user will be prompted to allow their geolocation to be read when they open their browser to the Landing page. Once confirmed the user can select their Input Parameters and click Find Station to return results. 

![This shows the landing page where uses can inlcude there Fuel Choice, Radius and sort by options](./assets/images/FuelSeeker_Landing.PNG)
The results are returned showing a Large Google Map with the Users location and all of the Fuel Markers places on the Map.

![This shows a large map with the users location and markers of the fuel stations](./assets/images/largeMap.PNG)
There is also a small staic map for each result showing the directions from A (User Location) to B (Fuel Location).

![This shows a panned out, all-inclusive view of the results returned.](./assets/images/results-cards-2.png)
This shows a panned out view of the results returned.  (Note that the positioning of the fixed bar across the middle of the page is an artifact of a full page screenshot and does not occur from the website viewer's point of view).



## Credits

- Peter Cao - https://github.com/ptrcao
- Joana Villajuan - https://github.com/joanavillajuan
- Dylan Stroud - https://github.com/Dylan-Stroud
- Sarah Mullock - https://github.com/smullock






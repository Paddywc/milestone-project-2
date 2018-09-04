# Destination explorer 

## Overview
![App Screenshot](https://i.snag.gy/0Mandi.jpg)

### What is the website for?
Searching for restaurants, accommodation, and tourist attractions at any holiday destination

### What does it do?
Displays a map where users can navigate to their next holiday destination using a search box. Users can view markers on the map for local bars, restaurants, accommodation, and tourist attractions. Additionally, they can view the yelp rating and (if available) price estimate for each activity

### How does it work?
By using the [Google Maps API](https://cloud.google.com/maps-platform/) to display the map and enable the search box functionality. The website employs the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial). All other interactive elements of the website are also written in JavaScript, supplemented by some jQuery. The website sends a GET request to the [Yelp Fusion API](https://www.yelp.ie/developers/documentation/v3) for information on local businesses and activities. This GET request sends the current map centre as the request coordinates, along with a list of business categories to filter the results by. To enable Cross-Origin Resource Sharing (CORS), this GET request is sent via [CORS Anywhere](https://github.com/Rob--W/cors-anywhere). The yelp response includes a latitude and longitude for each business, and these are used to place the markers on the map. Additional information from the yelp response, such as reviews, are displayed in cards for each business. If the user is on a mobile device, cards are replaced by info boxes. 

## UX
The website is designed to be easy-to-use for users with little technical knowledge. Users with more advanced technical knowledge would likely have other, more in-depth, methods for researching their holiday destination. However, this app could provide a viable alternative for these users, if they find it quicker to use than these other options. 
The UX design focused on this ease-of-use. This includes:
- Having a consistent colour coding for business types across markers, filter buttons, and cards 
- Displaying the current progress of the Yelp API request to the user, using simplified language
- Automatically clearing search results when the user uses the search box to move the map centre by more than 20 KM

The website was also designed to be quick and easy-to-use on mobile devices. Steps taken to ensure the same UX quality on smaller devices include:
- Replacing the filter buttons with a single dropdown list of checkboxes. This allows for the same functionality with less space. The filter buttons and checkboxes are synchronised, so the site will appear/function as expected if the user changes screen size  
-  Attempting to fit the business cards on smaller devices would only lead to a worse UX. Instead, info boxes appear when a marker is clicked, providing the same information that appears in the cards

## Features

### Existing Features
- An interactive map for any location
- A search box to navigate to a location. If the new location is more than 20KM away from the previous map centre, existing search results are cleared
- Markers and cards for local businesses 
- A responsive design where cards are replaced by info boxes on mobile devices
- Buttons to filter search results 
- Ability to clear specific search results upon re-clicking a filter button, while keeping any other search results
- Users can click on a marker to view its information card
- A ‘View on Map’ link on each card to view that business’s marker
- A button to start a new search that appears when a user moves the map
- Businesses that fit multiple categories (e.g. both a hotel (accommodation) and bar (food & drink)) are given a primary, secondary, and (if needs be) tertiary category. If the user removes search results for the primary category, the business is automatically assigned the secondary category, instead of being removed from the map
- Alerts that display the status of the Yelp API GET request to the user, including any errors

### Features Left to Implement
- None

## Tech Used

### Some of the tech used includes:
- **HTML**, **CSS** and **JavaScript**
    * Basic languages used for website
    * CSS code written in [styles.scss](https://github.com/Paddywc/milestone-project-2/blob/master/static/css/styles.scss) and compiled into [styles.css](https://github.com/Paddywc/milestone-project-2/blob/master/static/css/styles.css)
- [**Bootstrap**](http://getbootstrap.com/)
    * For the layout of the website 
    * Bootstrap components used include alerts, cards, and the modal
- [**JQuery**](https://jquery.com)
    * Used primarily for assigning styles to cards, enabling click functionality, and showing and hiding page elements
- **Ajax**
    * To send GET requests to the Yelp API
- [**Google Maps API**](https://cloud.google.com/maps-platform/)
    * To display the map and markers, and to enable search box functionality 
- [**Yelp Fusion API**](https://www.yelp.ie/developers/documentation/v3)
    * Uses [businesses search endpoint](https://www.yelp.ie/developers/documentation/v3/business_search) to get information on local businesses
- [**CORS Anywhere**](https://github.com/Rob--W/cors-anywhere)
    * As the Yelp API does not have CORS functionality, CORS Anywhere is used as a proxy request. This adds CORS headers to the request
- [**Jasmine**](https://jasmine.github.io/)
    * Used to unit test the JavaScript code. This code is found in [mapspecs.js](https://github.com/Paddywc/milestone-project-2/blob/master/static/specs/mapspecs.js) 

## Testing
- All code used on the site has been tested to ensure that everything works as expected
- Site viewed and tested on the following browsers:
    * Google Chrome
    * Mozilla Firefox
    * Safari 
    * Microsoft Edge

### Unit Tests
Unit tests can be found in [mapspecs.js](https://github.com/Paddywc/milestone-project-2/blob/master/static/specs/mapspecs.js). To enable or disable these unit tests, comment in/out the Jasmine framework script in the head, and the mapspecs script at the bottom, of the [index.html file](https://github.com/Paddywc/milestone-project-2/blob/master/index.html)

### Manual tests
While extensive unit testing was the primary way of testing the app, manual tests were also conducted, especially with relation to the visual elements of the map. Three of these tests are documented below

#### Displaying the API Request Status to the User
A simplified version of the Yelp API GET request status is displayed to the user via a Bootstrap alert. When the request begins, a ‘searching’ alert is displayed to the user. When the request finishes, this alert disappears and a ‘search complete’ or ‘error’ alert replaces it. However, manual testing revealed a bug in this approach. If the user started a second search before the first search was completed, it would affect the order of these messages. A ‘search complete’ alert could appear while the second search was still ongoing, or all alerts could temporarily become hidden. 
To fix this bug, the number of API calls in progress was added as a property of the global ‘destinationExplorerData’ object.  The ‘search complete’ message is only displayed to the user when the number of API calls in progress is 0. 

#### Yelp API Response not reflecting the Current Map Centre
Pressing the ‘Search this Area’ button should trigger a new Yelp API request for businesses near the current map’s centre. However, manual testing revealed a bug in this functionality. Even when the map’s centre had moved a significant distance, most of the businesses returned were still located in the largest nearby city. In the image below, the map centre used in the second search was close to ‘Rockbrook’, but most of the results were located in Dublin City Centre. 
![Location Bug Screenshot](https://i.snag.gy/TOZGP7.jpg)
A look at the [Yelp  API documentation](https://www.yelp.com/developers/documentation/v3/business_search) revealed that the size of the search area can be reduced. The search radius it therefore specified as 4KM from the current map centre. 
This largely fixed the bug. However, the Yelp API uses a [business’s area of operations when determining its location](https://github.com/Yelp/yelp-fusion/issues/15). Therefore, a business located in Dublin City Centre, but serving Rockbrook, will still appear when searching Rockbrook, with its marker located in Dublin City Centre.

#### Yelp Data not being removed from the Map
Even after deselecting all businesss type, some data could still remain on the map and cards.
![Remaining Data Bug Screenshot](https://i.snag.gy/HKpnha.jpg)
To determine the cause of this bug, one of these remaining businesses was identified and its yelp page visited. The business in question was categorised by Yelp as a ‘Bar’.  However, the getYelpCategoriesForBusinessType function only included (Yelp subcategories)[https://www.yelp.com/developers/documentation/v3/all_category_list], and not primary categories. In this example, it had included subcategories of ‘Bar’ (e.g. Airport Lounges), but not the actual ‘Bar’ category.  Therefore, it reached the else statement in the determineIconToUse function and was incorrectly given the Activities icon. However, since it did not contain any activity categories, it was not removed when the Activities results were removed.
To fix this bug, all primary Yelp categories were added to the getYelpCategoriesForBusinessType function. 

## Contributing

### Getting the code up and running 
1. Clone or download this GitHub repository using the ‘Clone or Download’ button found on [the main GitHub repository page](https://github.com/Paddywc/milestone-project-2). Use the default branch: Master. Alternatively, initialize git and pull the GitHub repository as a remote
2. Compile any SCSS code to CSS. Use [**Easy Sass**](https://marketplace.visualstudio.com/items?itemName=spook.easysass) if using Visual Code Studio. If using Cloud9, write ```$ sass --watch main.scss``` in the terminal
3. Make your changes
4. Submit a pull request 

## Deployment
The site is hosted on [GitHub Pages](https://paddywc.github.io/milestone-project-2/). The source of this code is the [gh-pages branch](https://github.com/Paddywc/milestone-project-2/tree/gh-pages) of the project GitHub repository. It mirrors the master branch in every way, with the exception of the following two changes in the [index.html file](https://github.com/Paddywc/milestone-project-2/blob/master/index.html):
- The leading slash is removed in URLs for files in the project directory (``` static/..``` rather than ```/static /..```) 
- The scripts for Jasmine testing have been commented out 

## Credits

### Code
- The sources for all non-original code are displayed in comments above the relevant code
- The JQuery Ajax Prefilter was taken from the [CORS anywhere README](https://github.com/Rob--W/cors-anywhere/blob/master/README.md)
- Filter term variables are categories for the GET request to the Yelp API. They are extracted from Yelp’s list of [all possible categories](https://www.yelp.com/developers/documentation/v3/all_category_list)
- The code in the createSearchbox function was taken from the [Google Maps API documentation](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox). Unlike the source code, it was extracted as a separate function. This was done to simplify the code and assist unit testing.  The code for getting the old and new map centres, and entering them into the clearDataIfMovedOverSpecifiedDistance function, is also original code
- The code inside the generateNewMap function is from the same [Google Maps API documentation](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox). Unlike the source code, it is extracted to a separate function which returns the map object. This enables unit testing
- The createAndViewMarkerInfoWindow function, which creates and opens a marker info window, uses code from the [Google Maps info window documentation](https://developers.google.com/maps/documentation/javascript/infoWindows). The code is adjusted to reflect the design and variable names in the Destination Explorer app
- Code for testing asynchronous functions in Jasmine is taken from [Meta Broadcast](https://metabroadcast.com/blog/asynchronous-testing-with-jasmine)
- Cards, alerts and modals use code from the [Bootstrap documention](https://getbootstrap.com/docs/4.0/getting-started/introduction/). This code is used as a base, with the content changed and variables renamed to fit the project
- The transition mixin in [styles.scss](https://github.com/Paddywc/milestone-project-2/blob/master/static/css/styles.scss) is from [Black Enigma on stackoverflow](https://stackoverflow.com/questions/40550070/multiple-transitions-with-scss)
- The code in [styles.scss](https://github.com/Paddywc/milestone-project-2/blob/master/static/css/styles.scss) for displaying material icons on all browser types is from the [Material Icons documentation](http://google.github.io/material-design-icons/)
- The [styles.scss](https://github.com/Paddywc/milestone-project-2/blob/master/static/css/styles.scss) code for centring the search button is from [Vinicius Santana on stackoverflow](https://stackoverflow.com/questions/7720730/how-to-align-the-absolute-position-to-center). The code is changed for tablets and desktops. This is to keep the button at the map’s centre when the cards column is added

### Additional Credits
- Markers displayed on the map are from [Icons8](https://icons8.com/)
- The font-families used in the app are from [Google Fonts](https://fonts.google.com/)
- The star icon displayed on highlighted cards, and the question mark on the ‘How it Works’ button, are from [Material icons](https://material.io/tools/icons/)

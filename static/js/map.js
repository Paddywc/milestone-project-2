// To avoid any other global variables
let destinationExplorerData = {
    map: "",
    currentYelpData: [],
};

function toggleButtonActiveClass(button) {
    if ($(button).hasClass("disabled")) {
        $(button).removeClass("disabled");
        $(button).addClass("active");
    }
    else {
        $(button).removeClass("active");
        $(button).addClass("disabled");
    }
};

function getSearchString() {
    // filters terms for yelp search API
    // chosen from list of possible categories: https://www.yelp.com/developers/documentation/v3/all_category_list
    let activities = 'streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours'
    let foodAndDrink = 'food,bars'
    let accommodation = 'guesthouses,campgrounds,hostels,hotels'

    let searchString = "";

    if ($("#activities-btn").hasClass("active")) {
        searchString += activities;
    };
    if ($("#food-drink-btn").hasClass("active")) {
        searchString += foodAndDrink;
    };
    if ($("#accommodation-btn").hasClass("active")) {
        searchString += accommodation;
    };

    return searchString;
}


function getYelpData(latitude, longitude, searchQuery) {

    function handleError(xhr, status, error) {
        console.log('Error! Failed to retrieve data. ' + xhr.status + ' error');
    }


    // Enables cors anywhere
    // Code from: https://github.com/Rob--W/cors-anywhere
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    return $.ajax({
        type: "GET",
        url: `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${searchQuery}`,
        success: function(response) {
            return response;
        },
        error: handleError,

        headers: {
            'authorization': 'Bearer UTSSHcFmhNyctmBOeWKD2eeg9GV_LRkqsdjDa3Q_WkwvGywmY0cxtFDWQt1ib4lgRiE1y9l0_uRPdU6O4fY1rn164iomb6Y7_wR9G-Ii3WPWScwM5UWBZaPSz3LCWnYx',
            'access-control-allow-origin': '*',
            'cache-control': 'no-cache',
        },
        crossDomain: true
    });
}

// Initial center of map is Dublin city center
let generateNewMap = function(latitude = 53.3498053, longitude = -6.2603097) {

    // Other than destinationExplorerData.map, below block of code from: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
    destinationExplorerData.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: latitude,
            lng: longitude
        },
        mapTypeId: 'roadmap'
    });

    return destinationExplorerData.map;
};


function initMapDestinationExplorer() {
    generateNewMap();
}


function ifUndefinedReturnNA(valueToCheck) {
    if (valueToCheck == null) {
        return 'N/A'
    }
    else {
        return valueToCheck
    }
}


function checkIfBusinessIsDuplicate(yelpBusiness) {
    let existingBusinessIds = [];
    let currentYelpData = destinationExplorerData.currentYelpData;

    currentYelpData.forEach(function(business) {
        existingBusinessIds.push(business.yelpId);
    });
    

    if (existingBusinessIds.includes(yelpBusiness.id)) {
        return true;
    }
    else {
        return false;
    }
}

// Filter out unnecessary data for yelp api
// Creates google maps marker for each entry
// Doesn't add business that already exists in currentYelpData
function retrieveRequiredYelpData(yelpData) {
    let businesses = yelpData.businesses;
    let requiredYelpData = [];
    businesses.forEach(function(business) {

        if (!checkIfBusinessIsDuplicate(business)) {
            let businessObject = {
                yelpId: business.id,
                name: business.name,
                img: business.image_url,
                yelpPrice: ifUndefinedReturnNA(business.price),
                yelpRating: business.rating,
                yelpPage: business.url,
                marker: new google.maps.Marker({
                    position: {
                        lat: business.coordinates.latitude,
                        lng: business.coordinates.longitude
                    }
                })
            };
            requiredYelpData.push(businessObject);
        }
    });

    let currentData = destinationExplorerData.currentYelpData;
    let currentAndNewData  = currentData.concat(requiredYelpData);
    destinationExplorerData.currentYelpData = currentAndNewData;
    console.log(currentAndNewData);
    return currentAndNewData;
}



function addMarkersToMap(map) {

    let markersArray = [];

    let yelpData = destinationExplorerData.currentYelpData;
  
    for (let i = 0; i < yelpData.length; i++) {
        markersArray.push(yelpData[i].marker);
    }
  
    // Places markers on map
    // with markerCluster functionality
    let markerCluster = new MarkerClusterer(destinationExplorerData.map, markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}


$(".filter-btn").click(function() {
    toggleButtonActiveClass($(this));
    if ($(this).hasClass("active")) {
        let searchString = getSearchString();
        getYelpData(53.3498053, -6.260309, searchString).then(function(yelpResponse) {
            retrieveRequiredYelpData(yelpResponse);
            addMarkersToMap(destinationExplorerData.map);
        });
    }

});

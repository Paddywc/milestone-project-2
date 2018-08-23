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

function returnData(data) {
    return data;
}

function getYelpData(latitude, longitude, searchQuery) {
    function handleError(xhr, status, error) {
        alert('Error! Failed to retrieve data. ' + xhr.status + ' error');
    }


    // Enables cors anywhere
    // Code from: https://github.com/Rob--W/cors-anywhere
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    let url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${searchQuery}`


    return $.ajax({
        type: "GET",
        url: `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${searchQuery}`,
        success: function(data) {
            returnData(data);
        },
        error: handleError,

        headers: {
            'authorization': 'Bearer UTSSHcFmhNyctmBOeWKD2eeg9GV_LRkqsdjDa3Q_WkwvGywmY0cxtFDWQt1ib4lgRiE1y9l0_uRPdU6O4fY1rn164iomb6Y7_wR9G-Ii3WPWScwM5UWBZaPSz3LCWnYx',
            'access-control-allow-origin': '*',
            'cache-control': 'no-cache',
            'postman-token': 'c6fca5f7-e9ee-017f-8b66-d13a9884ec6d'
        },
        crossDomain: true
    });
}

// creates new map
// initial center of map is Dublin city center
// Code from: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
let generateNewMap = function(latitude = 53.3498053, longitude = -6.2603097) {
    return new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: latitude,
            lng: longitude
        },
        mapTypeId: 'roadmap'
    });
};


// generates initial map with search bar
function initMapDestinationExplorer() {
    map = generateNewMap();
}




$(".filter-btn").click(function() {
    toggleButtonActiveClass($(this));
    let searchString = getSearchString();
    getYelpData(53.3498053, -6.260309, searchString).then(function(returnedData) {
        console.log(returnedData);
    });
});

// To avoid any other global variables
let destinationExplorerData = {
    map: "",
    currentYelpData: [],
    markerCluster: { markers_: [], clusters_: [] }
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

    //   Code from: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: latitude,
            lng: longitude
        },
        mapTypeId: 'roadmap'
    });

    return map;
};


function initMapDestinationExplorer() {
    destinationExplorerData.map = generateNewMap();
}


function ifUndefinedReturnNA(valueToCheck) {
    if (valueToCheck == null) {
        return 'N/A'
    }
    else {
        return valueToCheck
    }
}


function checkIfBusinessIsDuplicate(yelpBusiness, yelpData) {
    let existingBusinessIds = [];

    yelpData.forEach(function(business) {
        existingBusinessIds.push(business.yelpId);
    });


    if (existingBusinessIds.includes(yelpBusiness.id)) {
        return true;
    }
    else {
        return false;
    }
}


function getBusinessCategories(yelpBusiness) {
    let businessCategories = yelpBusiness.categories;
    let categoriesArray = [];
    for (let i = 0; i < businessCategories.length; i++) {
        categoriesArray.push(businessCategories[i].title);
    }
    return categoriesArray;
}

function determineBusinessType(businessCategories) {



    // Subcategories retrieved from yelp using filter terms from getSearchString
    // Data from: https://www.yelp.com/developers/documentation/v3/all_category_list
    let foodAndDrink = ['Acai Bowls', 'Backshop', 'Bagels', 'Bakeries', 'Beer, Wine & Spirits', 'Bento', 'Beverage Store', 'Breweries', 'Bubble Tea', 'Butcher', 'CSA', 'Chimney Cakes', 'Churros', 'Cideries', 'Coffee & Tea', 'Coffee & Tea Supplies', 'Coffee Roasteries', 'Convenience Stores', 'Cupcakes', 'Custom Cakes', 'Delicatessen', 'Desserts', 'Distilleries', 'Do-It-Yourself Food', 'Donairs', 'Donuts', 'Empanadas', 'Ethical Grocery', 'Farmers Market', 'Fishmonger', 'Food Delivery Services', 'Food Trucks', 'Friterie', 'Gelato', 'Grocery', 'Hawker Centre', 'Honey', 'Ice Cream & Frozen Yogurt', 'Imported Food', 'International Grocery', 'Internet Cafes', 'Japanese Sweets', 'Juice Bars & Smoothies', 'Kiosk', 'Kombucha', 'Milkshake Bars', 'Mulled Wine', 'Nasi Lemak', 'Organic Stores', 'Panzerotti', 'Parent Cafes', 'Patisserie/Cake Shop', 'Piadina', 'Poke', 'Pretzels', 'Salumerie', 'Shaved Ice', 'Shaved Snow', 'Smokehouse', 'Specialty Food', 'Candy Stores', 'Cheese Shops', 'Chocolatiers & Shops', 'Dagashi', 'Dried Fruit', 'Frozen Food', 'Fruits & Veggies', 'Health Markets', 'Herbs & Spices', 'Macarons', 'Meat Shops', 'Olive Oil', 'Pasta Shops', 'Popcorn Shops', 'Seafood Markets', 'Tofu Shops', 'Street Vendors', 'Sugar Shacks', 'Tea Rooms', 'Torshi', 'Tortillas', 'Water Stores', 'Wineries', 'Wine Tasting Room', 'Zapiekanka', 'BarsxxAbsinthe Bars', 'Airport Lounges', 'Beach Bars', 'Beer Bar', 'Champagne Bars', 'Cigar Bars', 'Cocktail Bars', 'Dive Bars', 'Drive-Thru Bars', 'Gay Bars', 'Hookah Bars', 'Hotel bar', 'Irish Pub', 'Lounges', 'Pubs', 'Pulquerias', 'Sake Bars', 'Speakeasies', 'Sports Bars', 'Tabac', 'Tiki Bars', 'Vermouth Bars', 'Whiskey Bars', 'Wine Bars'];

    let accommodation = ['Guest Houses', 'Hostels', 'Hotels', 'Agriturismi', 'Mountain Huts', 'Pensions', 'Residences', 'Rest Stops', 'Ryokan', 'Campgrounds'];

    for (let i = 0; i < businessCategories.length; i++) {

        if (foodAndDrink.includes(businessCategories[i])) {
            return "foodAndDrink";
        }
        else if (accommodation.includes(businessCategories[i])) {
            return "accommodation";
        }
    }
    return "activities";
}


// Filter out unnecessary data for yelp api
// Creates google maps marker for each entry
// Doesn't add business that already exists in currentYelpData
function retrieveRequiredYelpData(yelpData) {
    let businesses = yelpData.businesses;
    let requiredYelpData = [];
    businesses.forEach(function(business) {

        if (!checkIfBusinessIsDuplicate(business, destinationExplorerData.currentYelpData)) {
            let businessObject = {
                yelpId: business.id,
                name: business.name,
                categories: getBusinessCategories(business),
                businessType: determineBusinessType(getBusinessCategories(business)),
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
    let currentAndNewData = currentData.concat(requiredYelpData);
    return currentAndNewData;
}





function addMarkersToMap(currentYelpData, currentMarkerCluster, map) {

    let markersArray = [];

    let yelpData = currentYelpData;

    for (let i = 0; i < yelpData.length; i++) {
        markersArray.push(yelpData[i].marker);
    }
    if (currentMarkerCluster.markers_.length > 0) {
       currentMarkerCluster.clearMarkers();
    }

    // Places markers on map
    // with markerCluster functionality
    let markerCluster = new MarkerClusterer(destinationExplorerData.map, markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });


    return markerCluster;


}



function determineBusinesstypeToRemove(buttonPressed) {
    let typeToRemove = "";

    if ($(buttonPressed).is("#food-drink-btn")) {
        typeToRemove = "foodAndDrink";
    }
    else if ($(buttonPressed).is("#accommodation-btn")) {
        typeToRemove = "accommodation";
    }
    else {
        typeToRemove = "activities";
    }
    return typeToRemove;
}


function removeYelpData(yelpData, typeToRemove) {
    
    for (let i = 0; i < yelpData.length; i++) {
        if (yelpData[i].businessType === typeToRemove) {
            yelpData.splice(i, 1);
            i--;
        }
    }
    return yelpData;
}



$(".filter-btn").click(function() {
    toggleButtonActiveClass($(this));
    if ($(this).hasClass("active")) {
        let searchString = getSearchString();
        getYelpData(53.3498053, -6.260309, searchString).then(function(yelpResponse) {
            destinationExplorerData.currentYelpData = retrieveRequiredYelpData(yelpResponse);
            destinationExplorerData.markerCluster = addMarkersToMap(destinationExplorerData.currentYelpData, destinationExplorerData.markerCluster,  destinationExplorerData.map);
        });
    }
    else {
        let typeToRemove = determineBusinesstypeToRemove($(this));
        destinationExplorerData.currentYelpData = removeYelpData(destinationExplorerData.currentYelpData, typeToRemove);
        destinationExplorerData.markerCluster = addMarkersToMap(destinationExplorerData.currentYelpData, destinationExplorerData.markerCluster, destinationExplorerData.map);
    }



});

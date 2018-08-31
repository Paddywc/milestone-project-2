// To avoid any other global variables
let destinationExplorerData = {
    map: "",
    currentYelpData: [],
    markerCluster: { markers_: [], clusters_: [] },
    numberOfCallsRunning: 0
};


function userIsOnMobile() {
    // 567px width is Bootstrap SM- the screen width where cards appear on the page
    let windowWidth = $(window).width();
    if (windowWidth < 567) {
        return true;
    }
    else {
        return false;
    }
}


function getMapCenter(map) {

    let center = map.getCenter();

    return {
        center: center,
        lat: center.lat(),
        lng: center.lng()
    };
}

function calculateDistanceBetweenTwoCenters(oldCenter, newCenter) {
    // Returns the distance in meters between the two points
    return google.maps.geometry.spherical.computeDistanceBetween(oldCenter.center, newCenter.center);
}

function clearCardsIfMovedOverSpecifiedDistance(oldCenter, newCenter, distanceInKilometers) {
    let metersMoved = calculateDistanceBetweenTwoCenters(oldCenter, newCenter);
    if (metersMoved > (distanceInKilometers * 1000)) {
        let interval = setInterval(removeCardsWhenSearchComplete, 200);

        function removeCardsWhenSearchComplete() {
            if (destinationExplorerData.numberOfCallsRunning === 0) {
                $(".card-group").empty();
                clearInterval(interval);
            }
        }
    }
}



// Adds functionality to Google Maps Searcj
// Code from Google API documentation: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox.
// Added code to return old and new center and use them in clearCardsIfMovedOverSpecifiedDistance
function createSearchbox(map) {
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        let oldMapCenter = getMapCenter(map);

        let places = searchBox.getPlaces();

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        let bounds = new google.maps.LatLngBounds()
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log('Returned place contains no geometry');
                return;
            }
            let icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            }
            else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        let newMapCenter = getMapCenter(map);
        clearCardsIfMovedOverSpecifiedDistance(oldMapCenter, newMapCenter, 20);


    });
}


function toggleButtonActiveClass(button) {
    $(button).toggleClass("disabled");
    $(button).toggleClass("active");
}

// To avoid loop where clicking fitler checkbox triggers filter button click and vice versa
function checkIfFiltersSynchronized(button, checkbox) {

    if (($(button).hasClass("active") && $(checkbox).is(":checked")) || ($(button).hasClass("disabled") && !$(checkbox).is(":checked"))) {
        return true;
    }
    else {
        return false;
    }
}


function synchronizeButtonsAndCheckboxs(itemClicked) {


    let filtersAlreadySynchronized, filterCategory;

    if ($(itemClicked).hasClass("activities-filter")) {
        filterCategory = "activities"
        filtersAlreadySynchronized = checkIfFiltersSynchronized($("#activities-btn"), $("#activities-checkbox"))
    }
    else if ($(itemClicked).hasClass("food-drink-filter")) {
        filterCategory = "foodAndDrink"
        filtersAlreadySynchronized = checkIfFiltersSynchronized($("#food-drink-btn"), $("#food-drink-checkbox"))
    }
    else {
        filterCategory = "accommodation";
        filtersAlreadySynchronized = checkIfFiltersSynchronized($("#accommodation-btn"), $("#accommodation-checkbox"))
    }

    if (!filtersAlreadySynchronized) {

        if ($(itemClicked).hasClass("filter-checkbox")) {

            if (filterCategory === "activities") {
                $("#activities-btn").click();
            }
            else if (filterCategory === "foodAndDrink") {
                $("#food-drink-btn").click();
            }
            else {
                $("#accommodation-btn").click();
            }

        }
        else {
            if (filterCategory === "activities") {
                $("#activities-checkbox").click();
            }
            else if (filterCategory === "foodAndDrink") {
                $("#food-drink-checkbox").click();
            }
            else {
                $("#accommodation-checkbox").click();
            }
        }
    }
}


$(".filter-checkbox").click(function() {

    synchronizeButtonsAndCheckboxs(this);
})


function getSearchString() {
    // filters terms for yelp search API
    // chosen from list of possible categories: https://www.yelp.com/developers/documentation/v3/all_category_list
    let activities = 'streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours';
    let foodAndDrink = 'food,bars';
    let accommodation = 'guesthouses,campgrounds,hostels,hotels';

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


function displaySearchingToUser() {
    destinationExplorerData.numberOfCallsRunning++;
    $("#searching-alert").removeClass("hide");
}


function displaySearchErrorToUser(errorMessage) {
    $("#searching-alert").addClass("hide");
    $("#search-error-alert").prepend(errorMessage).removeClass("hide");
}

function displaySearchCompletedToUser() {
    destinationExplorerData.numberOfCallsRunning--;
    if (destinationExplorerData.numberOfCallsRunning === 0) {
        $("#searching-alert").addClass("hide")
        $("#search-complete-alert").removeClass("hide")
        setTimeout(function() {
            $("#search-complete-alert").addClass("hide");
        }, 3000);
    }
}


function getYelpData(latitude, longitude, searchQuery) {


    displaySearchingToUser();


    function handleError(xhr, status, error) {
        let errorMessage = 'Error! Failed to retrieve data. ' + xhr.status + ' error. '
        displaySearchErrorToUser(errorMessage)
        console.log(errorMessage);
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
        url: `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=3000&categories=${searchQuery}`,
        success: function(response) {
            displaySearchCompletedToUser();
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




function ifUndefinedReturnNA(valueToCheck) {
    if (valueToCheck == null) {
        return 'N/A';
    }
    else {
        return valueToCheck;
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

// For displaying categories to the user on cards/infoboxes
function convertBusinessCategoriesToString(categoriesArray) {
    let categoriesString = "";
    for (let i = 0; i < categoriesArray.length; i++) {
        categoriesString += categoriesArray[i];
        if (i < (categoriesArray.length - 1)) {
            categoriesString += ", ";
        }
    }

    return categoriesString;
}

function getYelpCategoriesForBusinessType(businessType) {

    // Subcategories retrieved from yelp using filter terms from getSearchString
    // Data from: https://www.yelp.com/developers/documentation/v3/all_category_list
    let foodAndDrink = ['Acai Bowls', 'Backshop', 'Bagels', 'Bakeries', 'Beer, Wine & Spirits', 'Bento', 'Beverage Store', 'Breweries', 'Bubble Tea', 'Butcher', 'CSA', 'Chimney Cakes', 'Churros', 'Cideries', 'Coffee & Tea', 'Coffee & Tea Supplies', 'Coffee Roasteries', 'Convenience Stores', 'Cupcakes', 'Custom Cakes', 'Delicatessen', 'Desserts', 'Distilleries', 'Do-It-Yourself Food', 'Donairs', 'Donuts', 'Empanadas', 'Ethical Grocery', 'Farmers Market', 'Fishmonger', 'Food Delivery Services', 'Food Trucks', 'Friterie', 'Gelato', 'Grocery', 'Hawker Centre', 'Honey', 'Ice Cream & Frozen Yogurt', 'Imported Food', 'International Grocery', 'Internet Cafes', 'Japanese Sweets', 'Juice Bars & Smoothies', 'Kiosk', 'Kombucha', 'Milkshake Bars', 'Bars', 'Mulled Wine', 'Nasi Lemak', 'Organic Stores', 'Panzerotti', 'Parent Cafes', 'Patisserie/Cake Shop', 'Piadina', 'Poke', 'Pretzels', 'Salumerie', 'Shaved Ice', 'Shaved Snow', 'Smokehouse', 'Specialty Food', 'Candy Stores', 'Cheese Shops', 'Chocolatiers & Shops', 'Dagashi', 'Dried Fruit', 'Frozen Food', 'Fruits & Veggies', 'Health Markets', 'Herbs & Spices', 'Macarons', 'Meat Shops', 'Olive Oil', 'Pasta Shops', 'Popcorn Shops', 'Seafood Markets', 'Tofu Shops', 'Street Vendors', 'Sugar Shacks', 'Tea Rooms', 'Torshi', 'Tortillas', 'Water Stores', 'Wineries', 'Wine Tasting Room', 'Zapiekanka', 'BarsxxAbsinthe Bars', 'Airport Lounges', 'Beach Bars', 'Beer Bar', 'Champagne Bars', 'Cigar Bars', 'Cocktail Bars', 'Dive Bars', 'Drive-Thru Bars', 'Gay Bars', 'Hookah Bars', 'Hotel bar', 'Irish Pub', 'Lounges', 'Pubs', 'Pulquerias', 'Sake Bars', 'Speakeasies', 'Sports Bars', 'Tabac', 'Food', 'Tiki Bars', 'Vermouth Bars', 'Whiskey Bars', 'Wine Bars'];

    let accommodation = ['Guest Houses', 'Hostels', 'Hotels', 'Agriturismi', 'Mountain Huts', 'Pensions', 'Residences', 'Rest Stops', 'Ryokan', 'Campgrounds'];

    let activities = ["Active Life", "Street Art", "Race Tracks", "Professional Sports Teams", "Performing Arts", "Opera & Ballet", "Museums", "Art Museums", "Children's Museums", "Trade Fairs", "General Festivals", "Fun Fair", "Christmas Markets", "Festivals", "Cultural Center", "Country Clubs", "Castles", "Cabaret", "Botanical Gardens", "Art Galleries", "Tours", "Aerial Tours", "Architectural Tours", "Art Tours", "Beer Tours", "Bike tours", "Boat Tours", "Bus Tours", "Food Tours", "Historical Tours", "Scooter Tours", "Walking Tours", "Whale Watching Tours", "Wine Tours", "Active Life", "ATV Rentals/Tours", "Airsoft", "Amateur Sports Teams", "Amusement Parks", "Aquariums", "Archery", "Axe Throwing", "Badminton", "Baseball Fields", "Basketball Courts", "Bathing Area", "Batting Cages", "Beach Equipment Rentals", "Beach Volleyball", "Beaches", "Bicycle Paths", "Bike Parking", "Bike Rentals", "Boating", "Bobsledding", "Bocce Ball", "Bowling", "Bubble Soccer", "Bungee Jumping", "Carousels", "Challenge Courses", "Climbing", "Cycling Classes", "Day Camps", "Disc Golf", "Diving", "Free Diving", "Scuba Diving", "Escape Games", "Experiences", "Fencing Clubs", "Fishing", "Fitness & Instruction", "Aerial Fitness", "Barre Classes", "Boot Camps", "Boxing", "Cardio Classes", "Dance Studios", "EMS Training", "Golf Lessons", "Gyms", "Circuit Training Gyms", "Interval Training Gyms", "Martial Arts", "Brazilian Jiu-jitsu", "Chinese Martial Arts", "Karate", "Kickboxing", "Muay Thai", "Taekwondo", "Meditation Centers", "Pilates", "Qi Gong", "Self-defense Classes", "Swimming Lessons/Schools", "Tai Chi", "Trainers", "Yoga", "Flyboarding", "Gliding", "Go Karts", "Golf", "Gun/Rifle Ranges", "Gymnastics", "Handball", "Hang Gliding", "Hiking", "Horse Racing", "Horseback Riding", "Hot Air Balloons", "Indoor Playcentre", "Jet Skis", "Kids Activities", "Kiteboarding", "Lakes", "Laser Tag", "Lawn Bowling", "Mini Golf", "Mountain Biking", "Nudist", "Paddleboarding", "Paintball", "Parasailing", "Parks", "Dog Parks", "Skate Parks", "Playgrounds", "Public Plazas", "Races & Competitions", "Racing Experience", "Rafting/Kayaking", "Recreation Centers", "Rock Climbing", "Sailing", "Scavenger Hunts", "Scooter Rentals", "Senior Centers", "Skating Rinks", "Skiing", "Skydiving", "Sledding", "Snorkeling", "Soccer", "Sport Equipment Hire", "Sports Clubs", "Squash", "Summer Camps", "Surf Lifesaving", "Surfing", "Swimming Pools", "Tennis", "Trampoline Parks", "Tubing", "Volleyball", "Water Parks", "Wildlife Hunting Ranges", "Ziplining", "Zoos", "Petting Zoos", "Zorbing"];


    if (businessType === "foodAndDrink") {
        return foodAndDrink;
    }
    else if (businessType === "accommodation") {
        return accommodation;
    }
    else {
        return activities;
    }

}

function determineBusinessTypes(businessCategories) {



    let foodAndDrink = getYelpCategoriesForBusinessType("foodAndDrink");
    let accommodation = getYelpCategoriesForBusinessType("accommodation");
    let activities = getYelpCategoriesForBusinessType("activities");

    let foundFoodAndDrink = false;
    let foundAccommodation = false;
    let foundActivities = false;

    for (let i = 0; i < businessCategories.length; i++) {

        if (foodAndDrink.includes(businessCategories[i])) {
            foundFoodAndDrink = true;
        }
        if (accommodation.includes(businessCategories[i])) {
            foundAccommodation = true;
        }
        if (activities.includes(businessCategories[i])) {
            foundActivities = true;
        }
    }

    let foodAndDrinkActive = $("#food-drink-btn").hasClass("active");
    let accommodationActive = $("#accommodation-btn").hasClass("active");
    let activitiesActive = $("#activities-btn").hasClass("active");

    let categoriesArray = [];


    // If multiple categories prioritize 1: accommodation, 2:activities 3: foodanddrink

    if (foundAccommodation && accommodationActive) {
        categoriesArray.push("accommodation");
    }
    if (foundActivities && activitiesActive) {
        categoriesArray.push("activities");
    }
    if (foundFoodAndDrink && foodAndDrinkActive) {
        categoriesArray.push("foodAndDrink");
    }
    if (foundAccommodation && !accommodationActive) {
        categoriesArray.push("accommodation");
    }
    if (foundActivities && !activitiesActive) {
        categoriesArray.push("activities");
    }
    if (foundFoodAndDrink && !foodAndDrinkActive) {
        categoriesArray.push("foodAndDrink");
    }



    return categoriesArray;
}




function determineIconToUse(yelpBusiness) {


    // icons to appear as markers on map
    let foodIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGTSURBVFhH7ZLPSsNAEIdz10I3Wyz6Lgp6EwR9GP+f9CiVbEKfo5rEk6BelF59EEUvehBEndlMQpwh3W71IuaDhcxvv5ndJg1aWkqyOPycZVF71U+lsxaUgu+i9t+7AJVOuO9bC5wCg/u+tcApMLjvWwucAoP7vrXAKTC471sLnAKD+761wCkwuO9bC1KjXlG4HPTnKGokPdEddNNYvVAU4DNmo6i3WNThXWrCW3zGjPsCEO6tlOhVihpBB13soQgvcI1Znqhtiipgb9/ONuqKIkkWq2OSUooaAS9HNzPqiCJ4g90Vm8XhG8zYSYd6CRfM3S2y8OM86i6TLhkN+gsgPtPgPYoFmQkP0IGBT/npfI9iC/5SPMjOqC2bTZhZkRu9BQe8F40qw1eN39t+80ivwaALu4dOojep7Ru5Uetw2E11OHwazGjbDQ6GAx7LAXzBn+shi7sbpDdS+lT6cTbsaGg+hMPGtYPH+Ppxj7SJ/OgCdWYd1F6gvcDfvUDZ6FqkNzKtJ6gfMmmR3si0Xst/Jwi+AL08M6wrFEz7AAAAAElFTkSuQmCC'
    let activitiesIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEsSURBVFhH7ZRNisJAEIV75R28gloRshyX4nFkTjEKcwHxCEa9hD9Hicu5wliveQ5RelpiuhQhHxSE95KqSnd1u5a6FL1eZ51l32uRkjGHRtseFNQGfq9CNdr2FCInX7Tf/9gMhyM2UNK259IAir+kgdAWFFn2RdseP4QiM/w1Y/aUIbz96/+Cr6cnVCwUfN2G1WAwQRHd8x0lh2do8CjZsRL59A2ILCjhVCx8A+pRskMLLbkCU0pYgSk0eJTs0Inf+2IiY0rQxtT2lOzQQj8ots3zLiWHZ9+AepRsiBWCBq/aWHJiSw2N3t/WJCc2bNDgVYczObHjFjqeyYldOKELqjGa7IikTUJX5MB09QklfCSYrj5NE7QNvG8Dlw9TB9PfJ/RximD6lpYbnDsDu+iNTz9RmNwAAAAASUVORK5CYII='
    let accommodationIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD4SURBVFhH7ZJBEoIwDEW5hCeChWek42l0pY6LlvsokVThpzTApLu+mYxN+/pTZmwqlRzny+vUOX+nojVvr0JO24cH1RY/yzfMBd+58KaidS6UzsaHDtGn9eFHLIdT6BQ8fllIhS6H/3363f0IHE79fAA+Yn6W8uMe63lIxOF8tHtQ7iwJCWvDIxiqDUA/5fygf+4WcRm6zx8/8MnbkhiYfSUzhR7zeUuiCoC5bx4IqD4KpXuBdsG6F6gCYO6bBwKqj0LpXqBdsO4FqgCY++aBgOqjULoXaBese4EqAOa+eSCg+lEoXTxO0vb+lrpgWa3zVx5XqTBN8wF05P4FG/6txAAAAABJRU5ErkJggg=='

    let businessType = determineBusinessTypes(getBusinessCategories(yelpBusiness))[0];

    if (businessType === "foodAndDrink") {
        return foodIcon;
    }
    else if (businessType === "accommodation") {
        return accommodationIcon;
    }
    else {
        return activitiesIcon;
    }

}

function createInfoWindowContent(marker, yelpData) {
    let fullBusinessData;
    yelpData.forEach(function(business) {
        if (business.marker === marker) {
            fullBusinessData = business;
        }
    });

    let infoWindowContent = `
       <div class="card infoWindow-card ${fullBusinessData.businessTypes[0]}" id="${fullBusinessData.yelpId}">
  
      <img class="card-img-top" src="${fullBusinessData.img}" alt="Business Image">
      <div class="card-body">
      
       <h5 class="card-title">${fullBusinessData.name}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${convertBusinessCategoriesToString(fullBusinessData.categories)}</h6>
  
      <p class="card-text">
      Yelp Rating: ${fullBusinessData.yelpRating}/5<br>
      Price: ${fullBusinessData.yelpPrice} 
      </p>
      <a href="${fullBusinessData.yelpPage}" target= "_blank" class="card-link">Yelp Page</a>
  
      </div>
      </div>
      `;

    return infoWindowContent;

}

function createAndViewMarkerInfoWindow(marker) {
    // Code partly from Google Maps documentation: https://developers.google.com/maps/documentation/javascript/infoWindows

    let infoWindowContent = createInfoWindowContent(marker, destinationExplorerData.currentYelpData);
    let infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });
    infoWindow.open(destinationExplorerData.map, marker);

}


function viewMarkerCard(businessId) {
    if (!$(`#${businessId}`).hasClass("highlight")) {
        $(".aside-card").removeClass("highlight");
        $(`#${businessId}`).addClass("highlight");

        $("#cards-col").animate({
            scrollTop: (($("#cards-col").scrollTop()) + ($(`#${businessId}`).offset().top))
        }, 2000);
    }
}


function viewInfoWindowOrCard(marker, businessId) {
    if (userIsOnMobile()) {
        createAndViewMarkerInfoWindow(marker);
    }
    else {
        viewMarkerCard(businessId);
    }
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
                businessTypes: determineBusinessTypes(getBusinessCategories(business)),
                img: business.image_url,
                yelpPrice: ifUndefinedReturnNA(business.price),
                yelpRating: business.rating,
                yelpPage: business.url,
                marker: new google.maps.Marker({
                    position: {
                        lat: business.coordinates.latitude,
                        lng: business.coordinates.longitude
                    },
                    icon: determineIconToUse(business)
                })
            };
            businessObject.marker.addListener("click", function() {
                // viewMarkerCard(businessObject.yelpId);
                viewInfoWindowOrCard(businessObject.marker, businessObject.yelpId);
            });
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



function determineBusinessTypesToRemove(buttonPressed) {
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


function checkIfOtherValidCategories(business) {


    function checkIfButtonActive(businessType) {
        if (businessType === "accommodation") {
            return $("#accommodation-btn").hasClass("active")
        }
        else if (businessType === "foodAndDrink") {
            return $("#food-drink-btn").hasClass("active")
        }
        else if (businessType === "activities") {
            return $("#activities-btn").hasClass("active")
        }
        else {
            return false;
        }
    }

    if (business.businessTypes.length > 1) {
        let originalBusinessType = business.businessTypes[0];
        for (let i = 1; i < business.businessTypes.length; i++) {
            if (checkIfButtonActive(business.businessTypes[i])) {
                let newMainType = business.businessTypes[i];
                business.businessTypes.splice(i, 1);
                business.businessTypes[0] = newMainType;
                business.businessTypes.push(originalBusinessType);
                business.marker.icon = determineIconToUse(business);
                return business;
            }
        }
        return false;
    }
    else {
        return false;
    }

}

function removeYelpData(yelpData, typeToRemove) {

    for (let i = 0; i < yelpData.length; i++) {
        if (yelpData[i].businessTypes[0] === typeToRemove) {
            yelpData[i] = checkIfOtherValidCategories(yelpData[i]);
            if (yelpData[i] === false) {
                yelpData.splice(i, 1);
                i--;
            }
        }
    }
    return yelpData;
}


function showSearchButton() {
    $("#search-btn").removeClass("hide")
}

function hideSearchButton() {
    $("#search-btn").addClass("hide")
}

let showOrHideModalButton = function() {
    if (!userIsOnMobile() && $(".aside-card").length === 0) {
        $("#modal-btn").addClass("hide");
    }
    else {
        $("#modal-btn").removeClass("hide");
    }
};


$(window).resize(showOrHideModalButton);

function viewOnMap(businessId) {

    let businessMarker;
    destinationExplorerData.currentYelpData.forEach(function(business) {
        if (business.yelpId === businessId) {
            businessMarker = business.marker;
        }
    });

    destinationExplorerData.map.setCenter(businessMarker.position);
    destinationExplorerData.map.setZoom(17);
    businessMarker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        businessMarker.setAnimation(null);
    }, 3000);
}



function createNewCardsContent(yelpData) {
    let cardsContentString = "";
    if (yelpData.length > 0) {
        yelpData.forEach(function(business) {
            let card = `
      <div class="card aside-card ${business.businessTypes[0]}" id="${business.yelpId}">
  
      <img class="card-img-top" src="${business.img}" alt="Business Image">
      <div class="card-body">
      
      <h5 class="card-title">${business.name}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${convertBusinessCategoriesToString(business.categories)}</h6>
  
      <p class="card-text">
      Yelp Rating: ${business.yelpRating}/5<br>
      Price: ${business.yelpPrice} 
      </p>
            <a onclick="viewOnMap('${business.yelpId}')" href="#" class="card-link">View on Map</a>
      <a href="${business.yelpPage}" target= "_blank" class="card-link">Yelp Page</a>
  
      </div>
      </div>
      `;

            cardsContentString += card;
        });
    }

    return cardsContentString;
}


function addToCards(yelpData) {
    let newContent = createNewCardsContent(yelpData);
    $('#cards-content .card-group').append(newContent);
}



function addDataAndUpdatePage() {
    let searchString = getSearchString();
    // If at least one filter button is active
    if (searchString != "") {
        let mapCenter = getMapCenter(destinationExplorerData.map);
        getYelpData(mapCenter.lat, mapCenter.lng, searchString).then(function(yelpResponse) {
            destinationExplorerData.currentYelpData = retrieveRequiredYelpData(yelpResponse);
            destinationExplorerData.markerCluster = addMarkersToMap(destinationExplorerData.currentYelpData, destinationExplorerData.markerCluster, destinationExplorerData.map);
            addToCards(destinationExplorerData.currentYelpData);
            showOrHideModalButton();
        });
    }
}


function getRemovedData(newYelpData, oldYelpData) {
    let removedData = [];
    oldYelpData.forEach(function(business) {
        if (!newYelpData.includes(business)) {
            removedData.push(business);
        }
    });



    return removedData;


}


function extractRemovedIds(removedData) {
    let removedIds = [];
    for (let i = 0; i < removedData.length; i++) {
        removedIds.push(removedData[i].yelpId);
    }
    return removedIds;
}

function removeCards(removedData) {

    let removedIds = extractRemovedIds(removedData);

    $(".aside-card").each(function() {
        if (removedIds.includes(this.id)) {
            this.remove();
        }
    });

}


function removeDataAndUpdatePage(typeToRemove) {
    let oldYelpData = [];
    oldYelpData = oldYelpData.concat(destinationExplorerData.currentYelpData);

    destinationExplorerData.currentYelpData = removeYelpData(destinationExplorerData.currentYelpData, typeToRemove);
    destinationExplorerData.markerCluster = addMarkersToMap(destinationExplorerData.currentYelpData, destinationExplorerData.markerCluster, destinationExplorerData.map);

    let removedData = getRemovedData(destinationExplorerData.currentYelpData, oldYelpData);
    removeCards(removedData);
    showOrHideModalButton();
}



$(".filter-btn").click(function() {
    hideSearchButton();
    toggleButtonActiveClass($(this));
    synchronizeButtonsAndCheckboxs(this);
    if ($(this).hasClass("active")) {
        addDataAndUpdatePage();

    }
    else {
        let typeToRemove = determineBusinessTypesToRemove($(this));

        let interval = setInterval(removeDataWhenAllSearchesComplete, 200, typeToRemove);
        // For dealing with when the user deselects a search filter while the API call is in progress
        function removeDataWhenAllSearchesComplete(typeToRemove) {
            if (destinationExplorerData.numberOfCallsRunning === 0) {
                removeDataAndUpdatePage(typeToRemove);
                clearInterval(interval);
            }
        }
    }
});


$("#search-btn").click(function() {
    hideSearchButton();
    addDataAndUpdatePage();
});


function initMapDestinationExplorer() {
    showOrHideModalButton();
    destinationExplorerData.map = generateNewMap();
    createSearchbox(destinationExplorerData.map);
    destinationExplorerData.map.addListener('tilesloaded', function() {
        if ($(".filter-btn").hasClass("active")) {
            showSearchButton();
        }
    });
}

let toggleButtonActiveClass = function(button) {
    if ($(button).hasClass("disabled")) {
        $(button).removeClass("disabled");
        $(button).addClass("active");
    }
    else {
        $(button).removeClass("active");
        $(button).addClass("disabled");
    }
};

let getSearchString = function() {
    // filters terms for yelp search API
    // chosen from list of possible categories: https://www.yelp.com/developers/documentation/v3/all_category_list
    let activities = 'streetart,racetracks,sportsteams,theater,opera,museums,festivals,culturalcenter,countryclubs,castles,cabaret,gardens,galleries,active,tours'
    let foodAndDrink = 'food,bars'
    let accommodation = 'guesthouses,campgrounds,hostels,hotels'

    let searchString = "";
    
    if($("#activities-btn").hasClass("active")){
        searchString += activities;
    };
    if($("#food-drink-btn").hasClass("active")){
        searchString += foodAndDrink;
    };
    if($("#accommodation-btn").hasClass("active")){
        searchString += accommodation;
    };
    
    return searchString;
}



$(".filter-btn").click(function() {
    toggleButtonActiveClass($(this));
   let searchString = getSearchString();
});

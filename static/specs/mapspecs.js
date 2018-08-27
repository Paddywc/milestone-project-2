describe('toggleButtonActiveClass function', function() {

    afterEach(function() {
        $(".filter-btn").removeClass("active").addClass("disabled");
    })

    it("should exist", function() {
        expect(toggleButtonActiveClass).toBeDefined();
    });

    it("should add the active class and remove the disabled class when clicking on a disabled button", function() {
        $("#activities-btn").click()
        let hasActiveClass = $("#activities-btn").hasClass("active");
        let hasDisabledClass = $("#activities-btn").hasClass("disabled");
        expect(hasActiveClass).toBe(true);
        expect(hasDisabledClass).toBe(false);
    });

});

describe('getSearchString function', function() {



    afterEach(function() {
        $(".filter-btn").removeClass("active").addClass("disabled");
    })

    it("should exist", function() {
        expect(getSearchString).toBeDefined();
    });

    it("should return a string", function() {
        searchString = getSearchString()
        expect(typeof searchString).toBe("string")
    })

    it("should add search queries to returned string on button click", function() {
        $("#food-drink-btn").click();
        let firstSearchString = getSearchString();
        expect(firstSearchString).toBe('food,bars');

        $("#food-drink-btn").click();
        $("#accommodation-btn").click();
        let secondSearchString = getSearchString();
        expect(secondSearchString).toBe('guesthouses,campgrounds,hostels,hotels');

        $("#food-drink-btn").click();
        let thirdSearchString = getSearchString()
        expect(thirdSearchString).toBe(firstSearchString + secondSearchString);
    });

});

describe('getYelpData function', function() {



    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    //enables testing of asynchronous functions
    // postpones running of 'it' functions 
    //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
    beforeEach(function(done) {
        setTimeout(function() {
            result = 'a different value';
            done();
        }, 3000);
    });


    var results;
    getYelpData(53.3498053, -6.260309, "food,bars").then(function(returnData) {
        results = returnData;
    });

    it("Should exist", function() {
        expect(getYelpData).toBeDefined();
    });

    it("Should contain businesses information", function() {
        expect(results.businesses).toBeTruthy();
    });


    it("Should return and object", function() {
        expect(typeof results).toBe("object")

    });


});

describe("retrieveRequiredYelpData function", function() {


    it("should exist", function() {
        expect(retrieveRequiredYelpData).toBeDefined();
    })
    let sampleYelpApiresponse = {
        "businesses": [{
                "id": "rKvPQZcgjrQOLRU0phPoAQ",
                "alias": "queen-of-tarts-dublin-4",
                "name": "Queen of Tarts",
                "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/MvEgnV8zlh0KUurefW007Q/o.jpg",
                "is_closed": false,
                "url": "https://www.yelp.com/biz/queen-of-tarts-dublin-4?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
                "review_count": 425,
                "categories": [{
                        "alias": "desserts",
                        "title": "Desserts"
                    },
                    {
                        "alias": "tea",
                        "title": "Tea Rooms"
                    },
                    {
                        "alias": "breakfast_brunch",
                        "title": "Breakfast & Brunch"
                    }
                ],
                "rating": 4.5,
                "coordinates": {
                    "latitude": 53.3441209863508,
                    "longitude": -6.26752853393555
                },
                "transactions": [],
                "price": "€€",
                "location": {
                    "address1": "Cork Hill",
                    "address2": "Dame Street",
                    "address3": "",
                    "city": "Dublin",
                    "zip_code": "2",
                    "country": "IE",
                    "state": "D",
                    "display_address": [
                        "Cork Hill",
                        "Dame Street",
                        "Dublin 2",
                        "Republic of Ireland"
                    ]
                },
                "phone": "+35316707499",
                "display_phone": "+353 1 670 7499",
                "distance": 793.2020925529741
            },
            {
                "id": "ezxkn6C_GnL_aCsknDInoQ",
                "alias": "murphys-ice-cream-dublin-2",
                "name": "Murphy's Ice Cream",
                "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/fPbf6TwtB_pJwz4u_GJwtg/o.jpg",
                "is_closed": false,
                "url": "https://www.yelp.com/biz/murphys-ice-cream-dublin-2?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
                "review_count": 262,
                "categories": [{
                        "alias": "icecream",
                        "title": "Ice Cream & Frozen Yogurt"
                    },
                    {
                        "alias": "desserts",
                        "title": "Desserts"
                    }
                ],
                "rating": 4.5,
                "coordinates": {
                    "latitude": 53.3429471,
                    "longitude": -6.2615189
                },
                "transactions": [],
                "price": "€",
                "location": {
                    "address1": "27 Wicklow Street",
                    "address2": null,
                    "address3": null,
                    "city": "Dublin",
                    "zip_code": "2",
                    "country": "IE",
                    "state": "D",
                    "display_address": [
                        "27 Wicklow Street",
                        "Dublin 2",
                        "Republic of Ireland"
                    ]
                },
                "phone": "+353669152644",
                "display_phone": "+353 66 915 2644",
                "distance": 766.8137258596315
            },
            {
                "id": "htRFt8839ESFFV9Wnvu5iQ",
                "alias": "jameson-distillery-bow-st-dublin",
                "name": "Jameson Distillery Bow St",
                "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/42AqwYiGSfLx6oJBcto07w/o.jpg",
                "is_closed": false,
                "url": "https://www.yelp.com/biz/jameson-distillery-bow-st-dublin?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
                "review_count": 375,
                "categories": [{
                        "alias": "museums",
                        "title": "Museums"
                    },
                    {
                        "alias": "winetours",
                        "title": "Wine Tours"
                    },
                    {
                        "alias": "distilleries",
                        "title": "Distilleries"
                    }
                ],
                "rating": 4,
                "coordinates": {
                    "latitude": 53.3484,
                    "longitude": -6.27651
                },
                "transactions": [],
                "price": "€€",
                "location": {
                    "address1": "Bow Street",
                    "address2": "Smithfield Village",
                    "address3": null,
                    "city": "Dublin",
                    "zip_code": "7",
                    "country": "IE",
                    "state": "D",
                    "display_address": [
                        "Bow Street",
                        "Smithfield Village",
                        "Dublin 7",
                        "Republic of Ireland"
                    ]
                },
                "phone": "+35318072355",
                "display_phone": "+353 1 807 2355",
                "distance": 1086.657738117655
            },
            {
                "id": "a_MeMmiSST5glL2kbsmPQw",
                "alias": "guinness-storehouse-dublin",
                "name": "Guinness Storehouse",
                "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/OZj6df2vSZ31nhWnaMSWAw/o.jpg",
                "is_closed": false,
                "url": "https://www.yelp.com/biz/guinness-storehouse-dublin?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
                "review_count": 1229,
                "categories": [{
                        "alias": "breweries",
                        "title": "Breweries"
                    },
                    {
                        "alias": "museums",
                        "title": "Museums"
                    }
                ],
                "rating": 4,
                "coordinates": {
                    "latitude": 53.3419,
                    "longitude": -6.28654
                },
                "transactions": [],
                "price": "€€",
                "location": {
                    "address1": "St James's Gate",
                    "address2": null,
                    "address3": null,
                    "city": "Dublin",
                    "zip_code": "8",
                    "country": "IE",
                    "state": "D",
                    "display_address": [
                        "St James's Gate",
                        "Dublin 8",
                        "Republic of Ireland"
                    ]
                },
                "phone": "+35314084800",
                "display_phone": "+353 1 408 4800",
                "distance": 1950.5506369376185
            }
        ],
        "total": 1700,
        "region": {
            "center": {
                "longitude": -6.260309,
                "latitude": 53.3498053
            }
        }
    };
    let yelpData = retrieveRequiredYelpData(sampleYelpApiresponse);



    it("should return variables of the expected type", function() {
        expect(typeof yelpData[0]).toBe("object");
        expect(typeof yelpData[0].name).toBe("string");
        expect(yelpData[0].img).toContain("http");
        expect(typeof yelpData[0].yelpRating).toBe("number");
        expect(yelpData[0].yelpPage).toContain("www.yelp.com");
    });





});

describe('generateNewMap function', function() {



    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });


    //enables testing of asynchronous functions
    // postpones running of 'it' functions 
    //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
    beforeEach(function(done) {
        setTimeout(function() {
            result = 'a different value';
            done();
        }, 5000);
    });

    let returnedMap = generateNewMap();


    it("should exist", function() {
        expect(generateNewMap).toBeDefined();
    });

    it("should return a roadmap", function() {
        expect(typeof returnedMap).toBe("object");
        expect(returnedMap.mapTypeId).toBe("roadmap");
    });
});

describe("ifUndefinedReturnNA function", function() {
    it("should exist", function() {
        expect(ifUndefinedReturnNA).toBeDefined();
    });

    let firstResult = ifUndefinedReturnNA(undefined);
    it("should return 'N/A' when undefined entered  ", function() {
        expect(firstResult).toBeDefined();
        expect(firstResult).toBe('N/A');
    });

    let definedArgument = "test argument";
    let secondResult = ifUndefinedReturnNA(definedArgument);
    it("should return argument if argument is not undefined ", function() {
        expect(secondResult).toBe(definedArgument);
    });
});


describe("addMarkersToMap function", function() {

    it("should exist", function() {
        expect(addMarkersToMap).toBeDefined()
    })

});

describe("checkIfBusinessIsDuplicate function", function() {

    it("should exist", function() {
        expect(checkIfBusinessIsDuplicate).toBeDefined();
    });




    let currentYelpData = [{ yelpId: "THf6siLJPYk5NqzkNSymfQ" }];

    let duplicateEntry = {
        id: "THf6siLJPYk5NqzkNSymfQ"
    };
    let nonDuplicateEntry = {
        id: "lI23WACyruQjEzH8CzI_NQ"
    };

    it("should return true if the argument business id already exists in currentYelpData", function() {
        expect(checkIfBusinessIsDuplicate(duplicateEntry, currentYelpData)).toBe(true);
    });

    it("should return false if the argument business id does NOT already exist in currentYelpData", function() {
        expect(checkIfBusinessIsDuplicate(nonDuplicateEntry, currentYelpData)).toBe(false);
    });
});


describe("getBusinessCategories function", function() {

    it("should exist", function() {
        expect(getBusinessCategories).toBeDefined()
    });

    let sampleYelpBusiness = {
        "id": "rKvPQZcgjrQOLRU0phPoAQ",
        "alias": "queen-of-tarts-dublin-4",
        "name": "Queen of Tarts",
        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/MvEgnV8zlh0KUurefW007Q/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/queen-of-tarts-dublin-4?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
        "review_count": 425,
        "categories": [{
                "alias": "desserts",
                "title": "Desserts"
            },
            {
                "alias": "tea",
                "title": "Tea Rooms"
            },
            {
                "alias": "breakfast_brunch",
                "title": "Breakfast & Brunch"
            }
        ],
        "rating": 4.5,
        "coordinates": {
            "latitude": 53.3441209863508,
            "longitude": -6.26752853393555
        },
        "transactions": [],
        "price": "€€",
        "location": {
            "address1": "Cork Hill",
            "address2": "Dame Street",
            "address3": "",
            "city": "Dublin",
            "zip_code": "2",
            "country": "IE",
            "state": "D",
            "display_address": [
                "Cork Hill",
                "Dame Street",
                "Dublin 2",
                "Republic of Ireland"
            ]
        },
        "phone": "+35316707499",
        "display_phone": "+353 1 670 7499",
        "distance": 793.2020925529741
    }

    it("should return all category titles for its argument", function() {
        let returnedCategories = getBusinessCategories(sampleYelpBusiness);
        expect(returnedCategories.length).toBe(3);
        expect(returnedCategories[0]).toBe("Desserts");
        expect(returnedCategories[1]).toBe("Tea Rooms");
        expect(returnedCategories[2]).toBe("Breakfast & Brunch");
    })
});

describe("determineBusinessType function", function() {

    it("should exist", function() {
        expect(determineBusinessType).toBeDefined()
    });


    let samepleFoodAndDrink = {
        "id": "feOIcCabfwn6PIK4KDwJog",
        "alias": "fallon-and-byrne-dublin-2",
        "name": "Fallon & Byrne",
        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/Pd5_A-GFmvytWnmd-BlPmQ/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/fallon-and-byrne-dublin-2?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
        "review_count": 220,
        "categories": [{
                "alias": "delis",
                "title": "Delis"
            },
            {
                "alias": "wine_bars",
                "title": "Wine Bars"
            },
            {
                "alias": "irish",
                "title": "Irish"
            }
        ],
        "rating": 4,
        "coordinates": {
            "latitude": 53.343141198853,
            "longitude": -6.26336171749372
        },
        "transactions": [],
        "price": "€€€",
        "location": {
            "address1": "11-17 Exchequer Street",
            "address2": "",
            "address3": "",
            "city": "Dublin",
            "zip_code": "2",
            "country": "IE",
            "state": "D",
            "display_address": [
                "11-17 Exchequer Street",
                "Dublin 2",
                "Republic of Ireland"
            ]
        },
        "phone": "+35314721000",
        "display_phone": "+353 1 472 1000",
        "distance": 768.2214475982008
    };
    let samepleFoodAndDrinkCategories = getBusinessCategories(samepleFoodAndDrink)

    let sampleAccommodation = {
        "id": "EN4nTASAUrLkK5uTD4yOLw",
        "alias": "brooks-hotel-dublin",
        "name": "Brook's Hotel",
        "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/ia-ITKl835klEDDq5GrwDw/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/brooks-hotel-dublin?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
        "review_count": 39,
        "categories": [{
            "alias": "hotels",
            "title": "Hotels"
        }],
        "rating": 4.5,
        "coordinates": {
            "latitude": 53.3422,
            "longitude": -6.26345
        },
        "transactions": [],
        "price": "€€",
        "location": {
            "address1": "Drury Street",
            "address2": null,
            "address3": null,
            "city": "Dublin",
            "zip_code": "2",
            "country": "IE",
            "state": "D",
            "display_address": [
                "Drury Street",
                "Dublin 2",
                "Republic of Ireland"
            ]
        },
        "phone": "+35316704000",
        "display_phone": "+353 1 670 4000",
        "distance": 870.9943349027225
    }
    let sampleAccommodationCategories = getBusinessCategories(sampleAccommodation)

    let sampleActivity = {
        "id": "skaxSREzHVY4OVGlIYxWYg",
        "alias": "national-gallery-of-ireland-dublin",
        "name": "National Gallery of Ireland",
        "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/j6Ixu7NV-BpscQQwMWh6tg/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/national-gallery-of-ireland-dublin?adjust_creative=ybCBnyfJrhBR0MTml5X8qw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ybCBnyfJrhBR0MTml5X8qw",
        "review_count": 57,
        "categories": [{
                "alias": "museums",
                "title": "Museums"
            },
            {
                "alias": "galleries",
                "title": "Art Galleries"
            }
        ],
        "rating": 4,
        "coordinates": {
            "latitude": 53.340918,
            "longitude": -6.252554
        },
        "transactions": [],
        "price": "€",
        "location": {
            "address1": "Merrion Square West",
            "address2": "",
            "address3": "",
            "city": "Dublin",
            "zip_code": "2",
            "country": "IE",
            "state": "D",
            "display_address": [
                "Merrion Square West",
                "Dublin 2",
                "Republic of Ireland"
            ]
        },
        "phone": "+35316615133",
        "display_phone": "+353 1 661 5133",
        "distance": 1114.2687069235947
    }
    let sampleActivityCategories = getBusinessCategories(sampleActivity);



    it("should accurately return the business type", function() {
        expect(determineBusinessType(samepleFoodAndDrinkCategories)).toBe("foodAndDrink");
        expect(determineBusinessType(sampleAccommodationCategories)).toBe("accommodation");
        expect(determineBusinessType(sampleActivityCategories)).toBe("activities");
    });
});

describe("removeYelpData function", function() {

    it("should exist", function() {
        expect(removeYelpData).toBeDefined();
    })

    let currentYelpData = [
        { businessType: "foodAndDrink" },
        { businessType: "foodAndDrink" },
        { businessType: "activities" },
        { businessType: "foodAndDrink" },
        { businessType: "foodAndDrink" },
        { businessType: "accommodation" },
        { businessType: "foodAndDrink" },
        { businessType: "activities" },
        { businessType: "activities" },
    ];

    let remainingBusinessTypes = [];

    it("should remove businesses of its argument business type from destinationExplorerData.currentYelpData", function() {
        currentYelpData = removeYelpData(currentYelpData, "activities");
        currentYelpData.forEach(function(business) {
            remainingBusinessTypes.push(business.businessType);
        });
        expect(remainingBusinessTypes.includes("activities")).toBe(false);
        expect(remainingBusinessTypes.includes("foodAndDrink")).toBe(true);


    })

})

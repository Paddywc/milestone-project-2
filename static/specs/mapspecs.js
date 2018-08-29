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
        }, 5000);
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

describe("determineBusinessTypes function", function() {

    beforeEach(function() {
        $(".filter-btn").removeClass("active").addClass("disabled");
    });

    it("should exist", function() {
        expect(determineBusinessTypes).toBeDefined()
    });


    it("should return an array where accommodation is always before activities and activities is always before foodAndDrink", function() {

        let allThree = {
            "categories": [{
                    "title": "Donuts"
                },
                {
                    "title": "Hostels"
                },
                {
                    "title": "Tours"
                }
            ]
        };

        let allThreeCategories = getBusinessCategories(allThree);
        $(".filter-btn").addClass("active").removeClass("disabled");
        let returnedData = determineBusinessTypes(allThreeCategories);
        expect(returnedData.length).toBe(3);
        expect(returnedData[0]).toBe("accommodation");
        expect(returnedData[1]).toBe("activities");
        expect(returnedData[2]).toBe("foodAndDrink");

    });

    it("should not return business types whose categories are not contained in the argument", function() {

        let accommodationAndFoodDrink = {
            "categories": [{
                    "title": "Donuts"
                },
                {
                    "title": "Bakeries"
                },
                {
                    "title": "Residences"
                }
            ]
        };
        $(".filter-btn").addClass("active").removeClass("disabled");

        let accommodationAndFoodDrinkCategories = getBusinessCategories(accommodationAndFoodDrink);
        let returnedData = determineBusinessTypes(accommodationAndFoodDrinkCategories);

        expect(returnedData.length).toBe(2);
        expect(returnedData[0]).toBe("accommodation");
        expect(returnedData[1]).toBe("foodAndDrink");
    });

    it("should should add categories whose button is active first", function() {

        let allThree = {
            "categories": [{
                    "title": "Donuts"
                },
                {
                    "title": "Hostels"
                },
                {
                    "title": "Tours"
                }
            ]
        };

        let allThreeCategories = getBusinessCategories(allThree);
        $(".filter-btn").addClass("active").removeClass("disabled");
        let returnedData = determineBusinessTypes(allThreeCategories);

        expect(returnedData[1]).toBe("activities");
        $("#activities-btn").addClass("disabled").removeClass("active");
        returnedData = determineBusinessTypes(allThreeCategories);
        expect(returnedData[1]).toBe("foodAndDrink");
    });
});

describe("getMapCenter function", function() {

    it("should exist", function(){
          expect(getMapCenter).toBeDefined();
    });

  it ("should return the lat and lng of the argument map", function(){
      let map = generateNewMap(42.23398053, -4.3303097000000434);
      mapCenter = getMapCenter(map);
      expect(mapCenter.lat).toBe(42.23398053);
      expect(mapCenter.lng).toBe(-4.3303097000000434);

  }); 

});

describe("removeYelpData function", function() {

    it("should exist", function() {
        expect(removeYelpData).toBeDefined();
    })


    it("should remove businesses of its argument business type from destinationExplorerData.currentYelpData if it has no other valid business types", function() {

        let currentYelpData = [
            { businessTypes: ["foodAndDrink"] },
            { businessTypes: ["foodAndDrink"] },
            { businessTypes: ["activities"] },
            { businessTypes: ["foodAndDrink"] },
            { businessTypes: ["foodAndDrink"] },
            { businessTypes: ["accommodation"] },
            { businessTypes: ["foodAndDrink"] },
            { businessTypes: ["activities"] },
            { businessTypes: ["activities"] },
        ];

        let remainingbusinessTypess = [];

        currentYelpData = removeYelpData(currentYelpData, "activities");
        currentYelpData.forEach(function(business) {
            remainingbusinessTypess.push(business.businessTypes[0]);
        });
        expect(remainingbusinessTypess.includes("activities")).toBe(false);
        expect(remainingbusinessTypess.includes("foodAndDrink")).toBe(true);
    });

});

describe("convertBusinessCategoriesToString function", function() {


    let categoriesArray = ["Hotel", "Restaurant", "Pub"];
    let returnedString = convertBusinessCategoriesToString(categoriesArray);

    it("should exist", function() {
        expect(convertBusinessCategoriesToString).toBeDefined();
    });

    it("should return a string that contains all elements in its argument array", function() {
        expect(typeof(returnedString)).toBe("string");
        expect(returnedString.includes(categoriesArray[0])).toBe(true);
        expect(returnedString.includes(categoriesArray[1])).toBe(true);
        expect(returnedString.includes(categoriesArray[2])).toBe(true);

    });

    it("should not end in a comma or a space", function() {
        let lastCharIndex = returnedString.length - 1;
        expect(returnedString[lastCharIndex]).not.toBe(",")
        expect(returnedString[lastCharIndex]).not.toBe(" ")
    });

    it("should contain one less comma than there are elements in the array", function() {
        let numberOfCommas = 0;
        for (let i = 0; i < returnedString.length; i++) {
            if (returnedString[i] === ",") {
                numberOfCommas += 1;
            }
        }
        expect(numberOfCommas).toBe(categoriesArray.length - 1)
    });




});

describe("createNewCardsContent function", function() {
    
    it("should exist", function(){
        expect(createNewCardsContent).toBeDefined();
    });
    
    it("should return a card for each element in its argument array", function() {
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
    
    let newCardsContent = createNewCardsContent(yelpData);
    let numberOfNewCards = newCardsContent.match(/aside-card/g).length;
    expect(numberOfNewCards).toBe(yelpData.length);
    });
})
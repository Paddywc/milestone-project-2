// describe('toggleButtonActiveClass function', function() {

//     afterEach(function() {
//         $(".filter-btn").removeClass("active").addClass("disabled");
//     })

//     it("should exist", function() {
//         expect(toggleButtonActiveClass).toBeDefined();
//     });

//     it("should add the active class and remove the disabled class when clicking on a disabled button", function() {
//         $("#activities-btn").click()
//         let hasActiveClass = $("#activities-btn").hasClass("active");
//         let hasDisabledClass = $("#activities-btn").hasClass("disabled");
//         expect(hasActiveClass).toBe(true);
//         expect(hasDisabledClass).toBe(false);
//     });

// });

// describe('getSearchString function', function() {

//     afterEach(function() {
//         $(".filter-btn").removeClass("active").addClass("disabled");
//     })

//     it("should exist", function() {
//         expect(getSearchString).toBeDefined();
//     });

//     it("should return a string", function() {
//         searchString = getSearchString()
//         expect(typeof searchString).toBe("string")
//     })

//     it("should add search queries to returned string on button click", function() {
//         $("#food-drink-btn").click();
//         let firstSearchString = getSearchString();
//         expect(firstSearchString).toBe('food,bars');

//         $("#food-drink-btn").click();
//         $("#accommodation-btn").click();
//         let secondSearchString = getSearchString();
//         expect(secondSearchString).toBe('guesthouses,campgrounds,hostels,hotels');

//         $("#food-drink-btn").click();
//         let thirdSearchString = getSearchString()
//         expect(thirdSearchString).toBe(firstSearchString + secondSearchString);
//     });

// });

// describe('getYelpData function', function() {

//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;


//     //enables testing of asynchronous functions
//     // postpones running of 'it' functions 
//     //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
//     beforeEach(function(done) {
//         setTimeout(function() {
//             result = 'a different value';
//             done();
//         }, 9000);
//     });
    
    
//     var results;
//     getYelpData(53.3498053, -6.260309, "food,bars").then(function(returnData) {
//         results = returnData;
//     });

//     it("Should exist", function() {
//         expect(getYelpData).toBeDefined();
//     });
    
//     it("Should contain businesses information", function() {
//         expect(results.businesses).toBeTruthy();
//     });


//     it("Should return and object", function() {
//         expect(typeof results).toBe("object")

//     });


// });

// describe("retrieveRequiredYelpData function", function() {

//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

//     //enables testing of asynchronous functions
//     // postpones running of 'it' functions 
//     //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
//     beforeEach(function(done) {
//         setTimeout(function() {
//             result = 'a different value';
//             done();
//         }, 9000);
//     });


//     var yelpData; 
//     var responseData;
    
//     getYelpData(53.3498053, -6.260309, "food,bar").then(function(yelpResponse) {
//         yelpData = retrieveRequiredYelpData(yelpResponse);
//         responseData = yelpResponse;
//     });

//     destinationExplorerData = {currentYelpData : []};
//     window.destinationExplorerData = destinationExplorerData;
    
    
//     it("should return variables of the expected type", function() {
//         expect(typeof yelpData[0]).toBe("object");
//         expect(typeof yelpData[0].name).toBe("string");
//         expect(yelpData[0].img).toContain("http");
//         expect(typeof yelpData[0].yelpRating).toBe("number");
//         expect(yelpData[0].yelpPage).toContain("www.yelp.com");
//     });
    
//     it("should add its returned data to currentYelpData", function() {
//         expect(destinationExplorerData.currentYelpData).toBe(yelpData);
//     });
    
//     it("should not add duplicate values", function() {
//         retrieveRequiredYelpData(yelpData);
//         expect(destinationExplorerData.currentYelpData).toBe(yelpData);
//     });
    
    


// })

// describe('generateNewMap function', function() {

//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

//     //enables testing of asynchronous functions
//     // postpones running of 'it' functions 
//     //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
//     beforeEach(function(done) {
//         setTimeout(function() {
//             result = 'a different value';
//             done();
//         }, 9000);
//     });


//     it("should exist", function() {
//         expect(generateNewMap).toBeDefined();
//     });

//     it("should return a roadmap", function() {
//         map = generateNewMap();
//         expect(typeof map).toBe("object");
//         expect(map.mapTypeId).toBe("roadmap");
//     })
    
//     it("should set its return map as destinationExplorerData.map", function() {
//         returnedMap = generateNewMap();
//         expect(destinationExplorerData.map).toBe(returnedMap)
//     })
// });

// describe("ifUndefinedReturnNA function", function() {
//     it("should exist", function() {
//         expect(ifUndefinedReturnNA).toBeDefined();
//     });

//     let firstResult = ifUndefinedReturnNA(undefined);
//     it("should return 'N/A' when undefined entered  ", function() {
//         expect(firstResult).toBeDefined();
//         expect(firstResult).toBe('N/A');
//     });

//     let definedArgument = "test argument";
//     let secondResult = ifUndefinedReturnNA(definedArgument);
//     it("should return argument if argument is not undefined ", function() {
//         expect(secondResult).toBe(definedArgument);
//     });
// });


// describe("addMarkersToMap function", function() {

//     it("should exist", function() {
//         expect(addMarkersToMap).toBeDefined()
//     })

// });

// describe("checkIfBusinessIsDuplicate function", function(){
    
//     it ("should exist", function(){
//         expect(checkIfBusinessIsDuplicate).toBeDefined();
//     });
    
    
//     destinationExplorerData = {currentYelpData : [{yelpId : "THf6siLJPYk5NqzkNSymfQ"}]};
    

    
    
//     let duplicateEntry = {
//         id: "THf6siLJPYk5NqzkNSymfQ"
//     };
//     let nonDuplicateEntry = {
//         id : "lI23WACyruQjEzH8CzI_NQ"
//     };
    
//     it ("should return true if the argument business id already exists in currentYelpData", function() {
//         expect(checkIfBusinessIsDuplicate(duplicateEntry)).toBe(true);
//     });
    
//      it ("should return false if the argument business id does NOT already exist in currentYelpData", function() {
//         expect(checkIfBusinessIsDuplicate(nonDuplicateEntry)).toBe(false);
//     });
    
// });

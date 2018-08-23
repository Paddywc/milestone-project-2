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

// describe('getYelpResults function', function() {

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

//     it("Should return and object", function() {
//         console.log(results)
//         expect(typeof results).toBe("object")

//     });


// });

describe("retrieveRequiredYelpData function", function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    //enables testing of asynchronous functions
    // postpones running of 'it' functions 
    //code source: https://metabroadcast.com/blog/asynchronous-testing-with-jasmine 
    beforeEach(function(done) {
        setTimeout(function() {
            result = 'a different value';
            done();
        }, 9000);
    });

    var yelpData

    getYelpData(53.3498053, -6.260309, "food,bar").then(function(yelpResponse) {
        yelpData = retrieveRequiredYelpData(yelpResponse);
    });

    it("should return variables of the expected type", function() {
        expect(typeof yelpData[0]).toBe("object");
        expect(typeof yelpData[0].name).toBe("string");
        expect(yelpData[0].img).toContain("http");
        expect(typeof yelpData[0].yelpRating).toBe("number");
        expect(yelpData[0].yelpPage).toContain("www.yelp.com");
    })

    it("should exist", function() {
        expect(retrieveRequiredYelpData).toBeDefined();
    });
})

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




//   it("should exist", function() {
//     expect(generateNewMap).toBeDefined();
//   });

//   it ("should return the expected variable types", function() {
//       map = generateNewMap();
//       expect(typeof map).toBe("object");
//       expect(map.mapTypeId).toBe("roadmap");
//   })
// });

describe('toggleButtonActiveClass function', function() {

    afterEach(function() {
        $(".filter-btn").removeClass("active").addClass("disabled");
    })

    it("Should exist", function() {
        expect(toggleButtonActiveClass).toBeDefined();
    });

    it("Should add the active class and remove the disabled class when clicking on a disabled button", function() {
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


    it("Should exist", function() {
        expect(getSearchString).toBeDefined();
    });

    it("Should return a string", function() {
        searchString = getSearchString()
        expect(typeof searchString).toBe("string")
    })

    it("Should add search queries to returned string on button click", function() {
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



    })



});

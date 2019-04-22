/* SET-UP */

// get reference to the table body and form elements
var tbody = d3.select("tbody");
var buttonFilter = d3.select("#filter-btn");
var buttonAll = d3.select("#all-btn");

/* MAIN ACTIVITY */

// load the whr_data.csv file
d3.csv("https://petitspoissons.github.io/WHR2019/assets/data/whr_all_years.csv").then(countryData => {

    // populate the table with all data when first loading the page
    populateTable(countryData);

    // COUNTRIES - prepare drop-down list of countries to select from
    var allCountries = countryData.map(d => d.country);
    var distinctCountries = []
    allCountries.forEach(country => {
        if (distinctCountries.indexOf(country) === -1) {
            distinctCountries.push(country);
        };
    });
    distinctCountries.sort();
    // append each country into the drop-down selection list
    distinctCountries.forEach(item => {
        d3.select("#countries").append("option").text(item).attr('value', item);
    });

    // function to handle user's click on `Filter Table`
    function handleFilter (event) {

        // prevent the page from refreshing
        d3.event.preventDefault();

        // grab the user's filters
        var inputCountry = d3.select("#countries").property("value");
        var inputYear = d3.select("#years").property("value");
        var inputRank = d3.select("#rank").property("value");
        //inputRank = +inputRank;

        // clear the existing table body
        tbody.html("");

        // filter countryData based on array of user selections
        var filteredData = countryData.filter( d => {            
            var filter = false;
            if (inputCountry === "all" || inputCountry === d.country) {
                if (inputYear === "all" || inputYear === d.year) {
                    if (inputRank === "" || inputRank === d.rank) {
                            filter = true;
                    }                   
                }
            };
            return filter;
        });
        //console.log(filteredData);
        populateTable(filteredData);
        document.getElementById("myForm").reset();

    }

    // function to handle user's click on `Filter Table`
    function handleClear (event) {

        tbody.html("");
        populateTable(countryData);
        document.getElementById("myForm").reset();
        /*
        dropDownCountry.selectedIndex = 0;
        dropDownRegion.selectedIndex = 0;
        dropDownYear.selectedIndex = 0;
        */

    }

    // event listeners
    buttonFilter.on("click", handleFilter);
    buttonAll.on("click", handleClear);

});


/* HELPER FUNCTIONS */

// function to populate the table
function populateTable(data) {
    data.forEach(d => {
        var row = tbody.append("tr")
            row.append("td").text(d.rank)
            row.append("td").text(d.country)
            row.append("td").text(d.year)
            row.append("td").text(d.ladder)
            row.append("td").text(d.well_being_inequality_1)
            row.append("td").text(d.positive_affect)
            row.append("td").text(d.negative_affect)
            row.append("td").text(d.social_support)
            row.append("td").text(d.freedom)
            row.append("td").text(d.corruption)
            row.append("td").text(d.generosity)
            row.append("td").text(d.log_gdp_per_capita)
            row.append("td").text(d.healthy_life_expectancy);
    });
}





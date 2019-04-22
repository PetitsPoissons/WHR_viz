// get reference to the table body and the buttons
var tbody = d3.select("tbody");
var buttonFilter = d3.select("#filter-btn");
var buttonAll = d3.select("#all-btn");

// function to populate the table
function populateTable(countryData) {
    countryData.forEach(d => {
        var row = tbody.append("tr")
            row.append("td").text(d.country)
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

// Load the whr_data.csv file
d3.csv("https://petitspoissons.github.io/WHR2019/assets/data/whr_data.csv").then(countryData => {
    console.log(countryData);
    // parse data
    countryData.forEach(d => {
        d.ladder = +d.ladder;
        d.well_being_inequality_1 = +d.well_being_inequality_1;
        d.positive_affect = +d.positive_affect;
        d.negative_affect = +d.negative_affect;
        d.social_support = +d.social_support;
        d.freedom = +d.freedom;
        d.corruption = +d.corruption;
        d.generosity = +d.generosity;
        d.log_gdp_per_capita = +d.log_gdp_per_capita;
        d.healthy_life_expectancy = +d.healthy_life_expectancy;
    });
    // populate the table with all data when first loading the page
    populateTable(countryData);
});

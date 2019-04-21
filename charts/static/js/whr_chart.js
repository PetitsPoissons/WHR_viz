// How About Peppering(Producing, Partaking) PYthonesque questions ?
var buttonSubmit = d3.select("#submit");

// Function to clear the svgArea
function clearSVG() {
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }
}

// Wrapper function to automatically resize the chart
function makeResponsive() {

    // Empty svgArea when the browser loads
    clearSVG();

    // Set chart parameters
    var svgWidth = parseInt(d3.select("#scatter").style("width"));
    var svgHeight = parseInt(d3.select("#scatter").style("height"));
    var margin = {top: 40, right: 40, bottom: 150, left: 120};
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chosenYear = d3.select("#chart_yr").property("value");
    var chosenXAxis = "log_gdp_per_capita";
    var chosenYAxis = "ladder";
    //var chosenZ = "well_being_inequality_1";

    // Create SVG wrapper
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append svg group and shift by margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Function used for updating x-scale var upon click on axis label
    function getXScale(data, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenXAxis] * 0.9), d3.max(data, d => d[chosenXAxis])])
            .range([0, chartWidth]);
        return xLinearScale;
    }

    // Function used for updating y-scale var upon click on axis label
    function getYScale(data, chosenYAxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenYAxis] * 0.9), d3.max(data, d => d[chosenYAxis])])
            .range([chartHeight, 0]);
        return yLinearScale;
    }

    // Function used for updating xAxis var upon click on axis label
    function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition().duration(1000).call(bottomAxis);
        return xAxis;
    }

    // Function used for updating yAxis var upon click on axis label
    function renderYAxis(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition().duration(1000).call(leftAxis);
        return yAxis;
    }

    // Function used for updating circles group upon click on x axis label
    function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
        circlesGroup.transition().duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));
        return circlesGroup;
    }

    // Function used for updating circles group upon click on y axis label
    function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
        circlesGroup.transition().duration(1000)
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }

    // Function used for updating country abbr group upon click on x axis label
    function renderXCountryText(countryTextGroup, newXScale, chosenXAxis) {
        countryTextGroup.transition().duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]));
        return countryTextGroup;
    }

    // Function used for updating country abbr group upon click on y axis label
    function renderYCountryText(countryTextGroup, newYScale, chosenYAxis) {
        countryTextGroup.transition().duration(1000)
            .attr("y", d => newYScale(d[chosenYAxis]));
        return countryTextGroup;
    }

    // Function to select a circle's fill color
    // World regions according to the World Bank
    // https://ourworldindata.org/world-region-map-definitions
    // North & Western Europe
    // Eastern Europe and Central Asia
    // South Asia
    // East Asia and Pacific
    // Middle East and North Africa
    // Sub-Saharan Africa
    // Latin America and Caribbean
    function getColor(subregion) {
        if (subregion === 'Southern Europe' || subregion === 'Western Europe'
        || subregion === 'Central Europe' || subregion === 'Northern Europe') {
            return "#92c5de";
        } else if (subregion === 'Eastern Europe' || subregion === 'Central Asia') {
            return "#b2abd2";
        } else if (subregion === 'Southern Asia') {
            return "#f1b6da";
        } else if (subregion === 'Australia and New Zealand' || subregion === 'South-Eastern Asia'
        || subregion === 'Eastern Asia') {
            return "#ff8800";
        } else if (subregion === 'Northern Africa' || subregion === 'Western Asia') {
            return "#800026";
        } else if (subregion === 'Western Africa' || subregion === 'Southern Africa'
        || subregion === 'Eastern Africa' || subregion === 'Middle Africa') {
            return "#d6604d";
        } else if (subregion === 'North America') {
            return "#ffdf00";
        } else {
            return "#41ab5d";
        }
    }

    // Function used for updating circles group with new tooltip
    function updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis) {

            // Change labels depending on the axes selected
            var xLabel;
            switch (chosenXAxis) {
                case "log_gdp_per_capita":
                    xLabel = "GDP per capita (ln)";
                    break;
                case "social_support":
                    xLabel = "Social support";
                    break;
                case "healthy_life_expectancy":
                    xLabel = "Healthy life expectancy at birth";
                    break;
                case "freedom":
                    xLabel = "Freedom to make life choices";
                    break;
                case "generosity":
                    xLabel = "Generosity";
                    break;
                case "corruption":
                    xLabel = "Perceptions of corruption";
                    break;
            }

            var yLabel;
            switch (chosenYAxis) {
                case "ladder":
                    yLabel = "Happiness Score (0-10)";
                    break;
                case "positive_affect":
                    yLabel = "Positive affect";
                    break;
                case "negative_affect":
                    yLabel = "Negative affect";
                    break;
            }
    
            // Create toolTip
            var toolTip = d3.tip()
                            .attr("class", "d3-tip")
                            .offset([-10, 0])
                            .html(d => `<h3>${d.flag_emoji} <strong>${d.country}</strong></h3>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}<br>${chosenYear} rank: ${d.rank}`);
            circlesGroup.call(toolTip);
    
            // Event listeners for toolTip
            circlesGroup.on("mouseover", toolTip.show)
                        .on("mouseout", toolTip.hide);
            countryTextGroup.on("mouseover", toolTip.show)
                        .on("mouseout", toolTip.hide);
            
            return circlesGroup;
        }
        
    // Retrieve data from the csv file and create chart
    d3.csv(`https://petitspoissons.github.io/WHR2019/assets/data/whr_${chosenYear}.csv`).then(data => {

        // Parse data
        data.forEach(d => {
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
        })

        // Create initial xLinearScale function
        var xLinearScale = getXScale(data, chosenXAxis);

        // Create initial yLinearScale function
        var yLinearScale = getYScale(data, chosenYAxis);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append initial x axis
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        // Append initial y axis
        var yAxis = chartGroup.append("g").call(leftAxis);

        // Append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)   //.data(nonNullData)
            .enter()
            .append("circle")
            .classed("countryCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 13)
            .attr("fill", d => getColor(d.subregion)); // play with radius size to code for happiness inequality
            // style: color code for regions

        // Append initial country abbreviations inside circles
        var countryTextGroup = chartGroup.selectAll()
            .data(data)
            .enter()
            .append("text")
            .classed("countryText", true)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .text(d => d.cca2);

        // Append initial tooltips
        circlesGroup = updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis);

        //Create the x-axes labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        var gdpLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "log_gdp_per_capita") // value to grab for event listener
            .classed("aText active", true)
            .text("GDP per capita (ln)");
        var socialSupportLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "social_support") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Social support");
        var lifeExpectancyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "healthy_life_expectancy") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Healthy life expectancy at birth");
        var freedomLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 80)
            .attr("value", "freedom") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Freedom to make life choices");
        var generosityLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 100)
            .attr("value", "generosity") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Generosity");
        var corruptionLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 120)
            .attr("value", "corruption") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Perceptions of corruption");

        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `rotate(-90)`);
        var ladderLabel = yLabelsGroup.append("text")
            .attr("y", -35)
            .attr("x", -chartHeight/2)
            .attr("value", "ladder")  // value to grab for event listener
            .classed("aText active", true)
            .text("Happiness Score (0-10)");
        var positiveAffectLabel = yLabelsGroup.append("text")
            .attr("y", -60)
            .attr("x", -chartHeight/2)
            .attr("value", "positive_affect") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Positive affect");
        var negativeAffectLabel = yLabelsGroup.append("text")
            .attr("y", -85)
            .attr("x", -chartHeight/2)
            .attr("value", "negative_affect") // value to grab for event listener
            .classed("aText inactive", true)
            .text("Negative affect");
    
        // x axis labels event listener
        xLabelsGroup.selectAll(".aText").on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            console.log('value: ' + value);
            if (value !== chosenXAxis) {
                // Replace chosenXAxis with value
                chosenXAxis = value;
                console.log('chosenXAxis: ' + value);
                // Update x scale for new data
                xLinearScale = getXScale(data, chosenXAxis);
                // Update x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);
                // Update circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                // Update state abbreviations inside circles
                countryTextGroup = renderXCountryText(countryTextGroup, xLinearScale, chosenXAxis);
                // Update tooltips with new info
                circlesGroup = updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis);
                // Change classes to change bold text
                switch (chosenXAxis) {
                    case "log_gdp_per_capita":
                        gdpLabel.classed("active", true).classed("inactive", false);
                        socialSupportLabel.classed("active", false).classed("inactive", true);
                        lifeExpectancyLabel.classed("active", false).classed("inactive", true);
                        freedomLabel.classed("active", false).classed("inactive", true);
                        generosityLabel.classed("active", false).classed("inactive", true);
                        corruptionLabel.classed("active", false).classed("inactive", true);
                        break;
                    case "social_support":
                        gdpLabel.classed("active", false).classed("inactive", true);
                        socialSupportLabel.classed("active", true).classed("inactive", false);
                        lifeExpectancyLabel.classed("active", false).classed("inactive", true);
                        freedomLabel.classed("active", false).classed("inactive", true);
                        generosityLabel.classed("active", false).classed("inactive", true);
                        corruptionLabel.classed("active", false).classed("inactive", true);
                        break;
                    case "healthy_life_expectancy":
                        gdpLabel.classed("active", false).classed("inactive", true);
                        socialSupportLabel.classed("active", false).classed("inactive", true);
                        lifeExpectancyLabel.classed("active", true).classed("inactive", false);
                        freedomLabel.classed("active", false).classed("inactive", true);
                        generosityLabel.classed("active", false).classed("inactive", true);
                        corruptionLabel.classed("active", false).classed("inactive", true);
                        break;
                    case "freedom":
                        gdpLabel.classed("active", false).classed("inactive", true);
                        socialSupportLabel.classed("active", false).classed("inactive", true);
                        lifeExpectancyLabel.classed("active", false).classed("inactive", true);
                        freedomLabel.classed("active", true).classed("inactive", false);
                        generosityLabel.classed("active", false).classed("inactive", true);
                        corruptionLabel.classed("active", false).classed("inactive", true);
                    case "generosity":
                        gdpLabel.classed("active", false).classed("inactive", true);
                        socialSupportLabel.classed("active", false).classed("inactive", true);
                        lifeExpectancyLabel.classed("active", false).classed("inactive", true);
                        freedomLabel.classed("active", false).classed("inactive", true);
                        generosityLabel.classed("active", true).classed("inactive", false);
                        corruptionLabel.classed("active", false).classed("inactive", true);
                    case "corruption":
                        gdpLabel.classed("active", false).classed("inactive", true);
                        socialSupportLabel.classed("active", false).classed("inactive", true);
                        lifeExpectancyLabel.classed("active", false).classed("inactive", true);
                        freedomLabel.classed("active", false).classed("inactive", true);
                        generosityLabel.classed("active", false).classed("inactive", true);
                        corruptionLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

        // y axis labels event listener
        yLabelsGroup.selectAll(".aText").on("click", function() {
            // Get value of selection
            var value = d3.select(this).attr("value");
            console.log('value: ' + value);
            if (value !== chosenYAxis) {
                // Replace chosenYAxis with value
                chosenYAxis = value;
                console.log('chosenYAxis: ' + value);
                // Update y scale for new data
                yLinearScale = getYScale(data, chosenYAxis);
                // Update y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);
                // Update circles with new x values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                // Update state abbreviations inside circles
                countryTextGroup = renderYCountryText(countryTextGroup, yLinearScale, chosenYAxis);
                // Update tooltips with new info
                circlesGroup = updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis);
                // Change classes to change bold text
                switch (chosenYAxis) {
                    case "ladder":
                        ladderLabel.classed("active", true).classed("inactive", false);
                        positiveAffectLabel.classed("active", false).classed("inactive", true);
                        negativeAffectLabel.classed("active", false).classed("inactive", true);
                    case "positive_affect":
                        ladderLabel.classed("active", false).classed("inactive", true);
                        positiveAffectLabel.classed("active", true).classed("inactive", false);
                        negativeAffectLabel.classed("active", false).classed("inactive", true);
                    case "negative_affect":
                        ladderLabel.classed("active", false).classed("inactive", true);
                        positiveAffectLabel.classed("active", false).classed("inactive", true);
                        negativeAffectLabel.classed("active", true).classed("inactive", false);
                }
            }
        });
    })
}
makeResponsive();
d3.select(window).on("resize", makeResponsive);
buttonSubmit.on("click", makeResponsive);


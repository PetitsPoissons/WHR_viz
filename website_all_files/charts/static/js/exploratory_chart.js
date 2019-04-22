// How About Peppering(or Producing) PYthonesque questions ?
// data set used here here 'whr_data_2018.csv'

// function to help prepare the drop down list(s) to select from
function makeDropDownList(allItems, distinctItems) {
    allItems.forEach ( item => {
        if (distinctItems.indexOf(item) === -1) {
            distinctItems.push(item);
        };
    });
}

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
    var margin = {top: 40, right: 40, bottom: 100, left: 100};
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chosenXAxis = d3.select("#xVar").property("value");
    var chosenYAxis = d3.select("#yVar").property("value");
    var buttonFilter = d3.select("#filter-btn");

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

    // Function used for updating circles group upon user' new selections
    function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
        circlesGroup.transition().duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }

    // Function used for updating state abbr group upon click on x axis label
    function renderCountryText(countryTextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
        countryTextGroup.transition().duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]));
        return countryTextGroup;
    }

    // Function used for updating circles group with new tooltip
    function updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis) {

            // Change labels depending on the axes selected
            var xLabel = axisLabel(chosenXAxis);

            var yLabel = axisLabel(chosenYAxis);
    
            // Create toolTip
            var toolTip = d3.tip()
                            .attr("class", "d3-tip")
                            .offset([-10, 0])
                            .html(d => `${d.common_name}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
            circlesGroup.call(toolTip);
    
            // Event listeners for toolTip
            circlesGroup.on("mouseover", toolTip.show)
                        .on("mouseout", toolTip.hide);
            countryTextGroup.on("mouseover", toolTip.show)
                        .on("mouseout", toolTip.hide);
            
            return circlesGroup;
        }
    
    function axisLabel(axisValue) {
        switch (axisValue) {
            case "ladder": return "Happiness Ladder";
            case "well_being_inequality_1": return "Happiness Inequality";
            case "positive_affect": return "Positive Affect";
            case "negative_affect": return "Negative Affect";
            case "social_support": return "Social Support";
            case "freedom": return "Freedom";
            case "corruption": return "Corruption";
            case "generosity": return "Generosity";
            case "log_gdp_per_capita": return "GDP per Capita (log)";
            case "healthy_life_expectancy": return "Life Expectancy";
            case "landlocked": return "landlocked";
            case "nb_borders": return "Number of Borders";
            case "area_sqkm": return "Country Area (sqkm)";
        }
    }

    // Retrieve data from the csv file and create chart
    d3.csv("https://petitspoissons.github.io/WHR2019/assets/data/whr_2018.csv").then(data => {

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
            d.nb_borders = +d.nb_borders;
            d.area_sqkm = +d.area_sqkm;
        })

        // REGIONS - prepare drop-down list of regions to select from
        var allRegions = data.map(d => d.subregion);
        var distinctRegions = []
        makeDropDownList(allRegions, distinctRegions);
        distinctRegions.sort();
        // append each region into the drop-down selection list
        distinctRegions.forEach(item => {
        d3.select("#regions").append("option").text(item);
        });

        // Filter dataset to remove countries with missing values on user selected X, Y, or Z axes
        var nonNullData = data.filter(d => {
            var filter = false;
            if (d.chosenXAxis !== 'n/a' && d.chosenYAxis !== 'n/a') {
                filter = true;
            };
            return filter;
        });
        console.log("line 177" + nonNullData);

        // Create initial xLinearScale function
        var xLinearScale = getXScale(nonNullData, chosenXAxis);

        // Create initial yLinearScale function
        var yLinearScale = getYScale(nonNullData, chosenYAxis);

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
            .data(nonNullData)
            .enter()
            .append("circle")
            .classed("countryCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 13);

        // Append initial country abbreviations inside circles
        var countryTextGroup = chartGroup.selectAll()
            .data(nonNullData)
            .enter()
            .append("text")
            .classed("countryText", true)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .text(d => d.cca2);

        // Append initial tooltips
        circlesGroup = updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis);

        //Create x and y axes labels and append to chart
        var xLabel = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
            .append("text")
            .attr("x", 0)
            .attr("y", 20)
            .classed("aText", true)
            .text(axisLabel(chosenXAxis));

        var yLabel = chartGroup.append("g")
            .attr("transform", `rotate(-90)`)
            .append("text")
            .attr("y", -35)
            .attr("x", -chartHeight/2)
            .classed("aText", true)
            .text(axisLabel(chosenYAxis));
    
        // Function to handle user's click on `Show Graph`
        function handleFilter (event) {

            // prevent the page from refreshing
            d3.event.preventDefault();

            // grab the user's selections
            chosenXAxis = d3.select("#xVar").property("value");
            chosenYAxis = d3.select("#yVar").property("value");

            // Filter dataset to remove countries with missing values on user selected X, Y axes
            nonNullData = data.filter(d => {
                var filter = false;
                if (d.chosenXAxis !== 'n/a' && d.chosenYAxis !== 'n/a') {
                        filter = true;
                };
                return filter;
            });

            // Update x and y scales for new data
            xLinearScale = getXScale(nonNullData, chosenXAxis);
            yLinearScale = getYScale(nonNullData, chosenYAxis);

            // Update x and y axes with transition
            xAxis = renderXAxis(xLinearScale, xAxis);
            yAxis = renderYAxis(yLinearScale, yAxis);

            // Update x and y axes labels
            xLabel = xLabel.text(axisLabel(chosenXAxis));
            yLabel = yLabel.text(axisLabel(chosenYAxis));

            // Update circles with new x and y values 
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // Update circles with new x and y values 
            countryTextGroup = renderCountryText(countryTextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // Update tooltips with new info
            circlesGroup = updateToolTip(circlesGroup, countryTextGroup, chosenXAxis, chosenYAxis);

        }

        // Event listener
        buttonFilter.on("click", handleFilter);
    })

}

makeResponsive();
d3.select(window).on("resize", makeResponsive);


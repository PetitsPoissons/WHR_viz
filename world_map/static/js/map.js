var happinessLayer;
var layer2018;
var inequalityLayer2018;
var layer2016;

// Define map object
var myMap = L.map("map", {
  center: [40, 30],
  zoom: 2
});

// Define lightmap and darkmap layers
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 2,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 2,
  id: "mapbox.dark",
  accessToken: API_KEY
});

/* CREATE CHOROPLETH LAYER */
d3.json("https://petitspoissons.github.io/WHR2019/assets/data/geodata_2018.json").then(data2018 => {

  layer2018 = createChoropleth(data2018);
  features_2018 = data2018.features;
  color_2018 = "#ffff00";
  inequalityLayer2018 = createInequalityLayer(features_2018, color_2018);

  // Moving on to the 2016 geodata
  d3.json("https://petitspoissons.github.io/WHR2019/assets/data/geodata_2016.json").then(data2016 => {
    layer2016 = createChoropleth(data2016);
    features_2016 = data2016.features;
    color_2016 = "#ffcc00";
    inequalityLayer2016 = createInequalityLayer(features_2016, color_2016); // then #ff6600

    // Moving on to the 2012 geodata
    d3.json("https://petitspoissons.github.io/WHR2019/assets/data/geodata_2012.json").then(data2012 => {
      layer2012 = createChoropleth(data2012);
      features_2012 = data2012.features;
      color_2012 = "#ff9933";
      inequalityLayer2012 = createInequalityLayer(features_2012, color_2012);

      // Moving on to the 2008 geodata
      d3.json("https://petitspoissons.github.io/WHR2019/assets/data/geodata_2008.json").then(data2008 => {
        layer2008 = createChoropleth(data2008);
        features_2008 = data2008.features;
        color_2008 = "#ff6600";
        inequalityLayer2008 = createInequalityLayer(features_2008, color_2008);

        // Sending all layers off to update the map
        updateMap(layer2018, layer2016, layer2012, layer2008, inequalityLayer2018, inequalityLayer2016, inequalityLayer2012, inequalityLayer2008);
      });


      
      

    });


  });
  
});
 
function createChoropleth(data) {

  happinessLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  });

  // Function to style the country based on happiness ladder
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.ladder),
      weight: 1,
      opacity: 1,
      color: 'snow',
      fillOpacity: .9
    };
  }

  // Function to call the event methods on the layer
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlight,
      mouseout: reset,
      click: zoomToCountry
    });
  }

  // Functions to handlle hovering over a country and out of it
  function highlight(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#fed976'
    });
    // Detect problematic types of browser
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    displayInfo.update(layer.feature.properties);
  }
  function reset(e) {
    happinessLayer.resetStyle(e.target);
    displayInfo.update();
  }

  // Function to zoom in on a country the user clicks on
  function zoomToCountry(e) {
    myMap.fitBounds(e.target.getBounds());
  }

  return happinessLayer;
}

function createInequalityLayer(features, color) {
  console.log(color);
  var inequalityMarkers = [];
  features.forEach(feature => {
    inequalityMarkers.push(
      L.circle([feature.properties.latitude, feature.properties.longitude], {
        stroke: false,
        fillOpacity: 0.75,
        color: "snow",
        fillColor: color,
        radius: markerSize(feature.properties.well_being_inequality_1)
      }).bindPopup(`<h2>${feature.properties.country}</h2><hr>
      <div>Happiness Rank: ${feature.properties.rank}</div>
      <div>Happiness Score: ${feature.properties.ladder} / 10 </div>
      <div>Happiness Inequality: ${feature.properties.well_being_inequality_1}</div>`)
    );
  });
  inequalityLayer = L.layerGroup(inequalityMarkers);
  return inequalityLayer;
}

function updateMap(layer2018, layer2016, layer2012, layer2008, inequalityLayer2018, inequalityLayer2016, inequalityLayer2012, inequalityLayer2008) {

  layer2018.addTo(myMap);

  // Define a baseMaps object to hold the base layers
  var baseMaps = {
    "light map": lightMap,
    "dark map": darkMap
  };

  // Create overlay object to hold the overlay layers
  var overlayMaps = {
    "2008": layer2008,
    "2012": layer2012,
    "2016": layer2016,
    "2018": layer2018,
    "HI 2018": inequalityLayer2018,
    "HI 2016": inequalityLayer2016,
    "HI 2012": inequalityLayer2012,
    "HI 2008": inequalityLayer2008
  };

  /* CONTROLS */
  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'bottomright'
  }).addTo(myMap);

}

/* MORE CONTROLS */
//Adding the legend
var legend = L.control({
  position: 'bottomleft'
});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var labels = ['<strong>Happiness Ladder</strong> (base year: 2016)<br>'];
  colors = ['#dd3497', '#f768a1', '#fa9fb5', '#fcc5c0', '#fde0dd', '#e0f3f8', '#abd9e9',
            '#74add1', '#4575b4', '#313695'];

  // Looping though ladder data and grabbing colors to place in the legend's key
  for (var i = 0; i < colors.length; i++) {
    div.innerHTML += labels.push(
      '<i style="background:' + colors[i] + '"></i>');
  }
  div.innerHTML = labels.join(' ');
  return div;
};

legend.addTo(myMap);

// Adding country info on hover
var displayInfo = L.control();

displayInfo.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info') // create a div with a class 'info'
  this.update();
  return this._div;
};

displayInfo.update = function (props) {
  this._div.innerHTML = (props ? '<h2>' + props.flag_emoji + '   ' + props.country + '</h2>' + '<hr>' + 
  'Capital: ' + props.capital + '<br>' + 'Demonym: ' + props.demonym + '<h4>' + '<b>' +
  'Happiness Rank: ' + props.rank + '</b>' + '</h4>' + 'Happiness Score: ' + props.ladder + ' / 10' + '<br>' + 'Happiness inequality: ' +
  props.well_being_inequality_1 + '<br>' + 'Change (last decade): ' + props.changes_happiness + '<br>' + ' ' + '<br>'
  : 'Hover over a color-coded country');
};

displayInfo.addTo(myMap);


/* HELPER FUNCTIONS */
// Function to determine color based on happiness ladder (quantiles calculated during ETL phase)
function getColor(ladderScore) {
  if (ladderScore === 'n/a') {
    return '#000000';
  } else if (ladderScore > 6.97) {
    return '#dd3497';
  } else if (ladderScore > 6.37) {
    return '#f768a1';
  } else if (ladderScore > 5.97) {
    return '#fa9fb5';
  } else if (ladderScore > 5.76) {
    return '#fcc5c0';
  } else if (ladderScore > 5.42) {
    return '#fde0dd';
  } else if (ladderScore > 5.18) {
    return '#e0f3f8';
  } else if (ladderScore > 4.65) {
    return '#abd9e9';
  } else if (ladderScore > 4.4) {
    return '#74add1';
  } else if (ladderScore > 4.01) {
    return '#4575b4';
  } else {
    return '#313695';
  }
}

function markerSize(happinessInequality) {
  happinessInequality = +happinessInequality;
  return happinessInequality**5 *1000;
}
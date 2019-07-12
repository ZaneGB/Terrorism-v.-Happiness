//*********************************************************************
// Creating our map object
//**********************************************************************




//======================================================================
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var mymap = L.map('map').setView([50.0755381, 14.43780049], 4);

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(' https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 10,
    minZoom: 3,
    accessToken: API_KEY,
    id: 'mapbox.dark'
}).addTo(mymap);
//======================================================================


//======================================================================
// Define our functions
//---------------------------------------------------------------------
//getColor assign colors based on thresholds 
function getColor(d) {
    return d > 400000 ? '#005824' :
        d > 25000 ? '#238b45' :
        d > 10000 ? '#41ae76' :
        d > 5000 ? '#66c2a4' :
        d > 1000 ? '#99d8c9' :
        d > 100 ? '#ccece6' :
        d > 0 ? '#edf8fb' :
        'snow'
}
//---------------------------------------------------------------------
//The style function colors each country based on the specific value of
//the selected variable
function style(feature) {
    return {
        fillColor: getColor(feature.properties.gdp_md_est),
        weight: 1,
        opacity: 1,
        color: 'snow',
        fillOpacity: .7
    };
}
//---------------------------------------------------------------------
//Highlight shows the border of the country in yellow when the mouse is
//hovered over the country 
function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    displayInfo.update(layer.feature.properties);
}
//---------------------------------------------------------------------
function reset(e) {
    geojson.resetStyle(e.target);
    displayInfo.update();
}
//---------------------------------------------------------------------
function zoomToCountry(e) {
    mymap.fitBounds(e.target.getBounds());
}
//---------------------------------------------------------------------
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: reset,
        click: zoomToCountry
    });
}
geojson = L.geoJson(countriesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);
//======================================================================


//======================================================================
//Legends section

//Initialize legend
var legend = L.control({
    position: 'bottomright'
});

//
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        colors = [0, 100, 1000, 5000, 10000, 25000, 40000],
        labels = [];

    div.innerHTML += '<h4> Lost GDP (millions Euro) </h4>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(colors[i] + 1) + '"></i>' +
            colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');

    }

    return div;
};
legend.addTo(mymap);

//
var legend2 = L.control({
    position: 'bottomleft'
});
legend2.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h3> Psychological effects of Terrorism </h3>' +
        '<b>' + 'Life Statisfaction = -0.7626 (0.049)***' + '<br />' +
        '<b>' + 'Happiness = -0.5689 (0.021)***' + '<br />' +
        '<b>' + 'Interpersonal Trust= -0.0875 (0.010)***' + '<br />' +
        '<b>' + '<br />' +
        '<b>' + 'Source: European Parliament (2018), "The fight against terrorism"' + '</b>';

    return div;
};
legend2.addTo(mymap);


// On hover control that displays information about hovered upon country
var displayInfo = L.control();

displayInfo.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};


// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function(props) {

    this._div.innerHTML = '<h2>GDP cost of terrorism in the EU </h2>' + '<h2>(2004-2016) </h2>' + (props ?
        '<h3>' + props.name + '</h3>' +
        '<b>' + 'Cost (Millions of Euros:) ' + '</b>' + props.gdp_md_est + '<br />' +
        '<b>' + 'Cost per capita (in Euros): ' + '</b>' + props.gdp_md_pc + '<br />' +
        '<b>' + 'Number of events: ' + '</b>' + props.tr_events + '<br />' +
        '<b>' + 'Deaths: ' + '</b>' + props.tr_kills + '<br />' +
        '<b>' + 'Injuries: ' + '</b>' + props.tr_wounds :
        'Hover over a EU meber state');
};
displayInfo.addTo(mymap);

// Happens on mouse hover
function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Updates custom legend on hover
    displayInfo.update(layer.feature.properties);
}

// Happens on mouse out
function reset(e) {
    geojson.resetStyle(e.target);
    // Resets custom legend when user unhovers
    displayInfo.update();
}
//======================================================================



//**********************************************************************
// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [40.58, -103.46],
  zoom: 5,
  layers: [basemap]
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      color: getColor(feature.geometry.coordinates[2]),
      weight: 1,
      opacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.5,
      radius: getRadius(feature.properties.mag)
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) {
      return "#FF5F65";
    }
    if (depth > 70) {
      return "#FCA35D";
    }
    if (depth > 50) {
      return "#FDB72A";
    }
    if (depth > 30) {
      return "#F7DB11";
    }
    if (depth > 10) {
      return "#DCF400";
    }
    if (depth > -10) {
      return "#A3F600";
    }
    return "#00FF00";
    }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><p>Location: " + feature.properties.place + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>")
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    const depthIntervals = [-10, 10, 30, 50, 70, 90];
    const intervalColors = [
      "#A3F600",
      "#DCF400",
      "#F7DB11",
      "#FDB72A",
      "#FCA35D",
      "#FF5F65"
    ];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthIntervals.length - 1; i++){
      let intervalStart = depthIntervals[i];
      let intervalEnd = depthIntervals[i + 1];

  
      div.innerHTML +=
      '<i style="background:' + intervalColors[i] + '"></i> ' +
      intervalStart + (intervalEnd ? "&ndash;" + intervalEnd : "+") + "<br>";
    }

    div.innerHTML +=
          '<i style="background:' + intervalColors[depthIntervals.length - 1] + '"></i> ' + "90+<br>";

    div.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    div.style.padding = "10px";

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});

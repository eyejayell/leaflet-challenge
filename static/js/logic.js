var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {

      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><p>Depth: ${feature.geometry.coordinates[2]}</p>Magnitude: ${feature.properties.mag}<p>`);
    }

    function colorSelector(depth) {
      if (depth < 10) {
        return "blue";
      } else if (depth < 30) {
        return "green";
      } else if (depth < 50) {
        return "yellow";
      } else if (depth < 90) {
        return "orange"; 
      } else {
        return "red";
      }
  }


    function pointToLayer(features, latlng) {
      var circle = {
        radius: features.properties.mag * 4,
        fillColor: colorSelector(features.geometry.coordinates[2]),
        color: colorSelector(features.geometry.coordinates[2]),
        fillOpacity: 0.8,
        weight: 1
      }
      return L.circleMarker(latlng, circle)
    }

    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer 
    });

    createMap(earthquakes);
};


function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
    
      var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

      var baseMaps = {
        "Topographic Map": topo,
        "Street Map": street
      };

      var overlayMaps = {
        Earthquakes: earthquakes
      };

      var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 3,
        layers: [topo, earthquakes]
      });

      var legend = L.control({
        position: "bottomright"
      });

      legend.addTo(myMap);

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);


    

};
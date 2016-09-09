(function() {
    'use strict';

    var map = {
        templateUrl: './app/component/map.html',
        controller: mapCtrl
    }
    angular
        .module('ecobici')
        .component('map', map);

    mapCtrl.$inject = ["apiEcobici"];

    function mapCtrl(apiEcobici) {
    	var map = this;

        var circleLayer = new L.layerGroup();
        var circle = null;

        var mymap = L.map('mapid').setView([19.426611, -99.14447], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);


        function clickMap(e) {
            circleLayer.clearLayers();
            circle = L.circle([e.latlng.lat, e.latlng.lng], 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            });
            circleLayer.addLayer(circle);
            circleLayer.addTo(mymap);
            mymap.fitBounds(e.target.getBounds());
        }

        mymap.on('click', clickMap);


    }
})()

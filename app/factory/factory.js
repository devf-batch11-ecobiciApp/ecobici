(function () {
	'use strict';

	function factoryEcobici ($q, $http) {
		var factory = {};
		factory._map_element = L.map('mapid').setView([19.4497336, -99.1753877], 13);
		factory._bikeStationMarkerGroup = new L.featureGroup();
		factory._markerLayerGroup = new L.layerGroup();
		factory._LayerGroup = L.layerGroup();

		factory.loaderTemplate = [
			'<div class="m-loading">',
				'<div id="floatingCirclesG">',
					'<div class="f_circleG" id="frotateG_01"></div>',
					'<div class="f_circleG" id="frotateG_02"></div>',
					'<div class="f_circleG" id="frotateG_03"></div>',
					'<div class="f_circleG" id="frotateG_04"></div>',
					'<div class="f_circleG" id="frotateG_05"></div>',
					'<div class="f_circleG" id="frotateG_06"></div>',
					'<div class="f_circleG" id="frotateG_07"></div>',
					'<div class="f_circleG" id="frotateG_08"></div>',
				'</div>',
			'</div>',
		].join('');

		/* Loader layer map */
		factory.layerIsLoading = function(){
			return angular.element(document.getElementsByTagName("body")).append(factory.loaderTemplate);
		};

		factory.layerIsLoaded = function(){
			return angular.element(document.getElementsByClassName('m-loading')).remove();
		};

		factory.map = function() {
			L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'mapbox.streets'
			}).addTo(factory._map_element);
		}

		factory.custom_icon = function() {
			return L.icon({
			  iconUrl: './assets/bicycle-pin.png',
			  iconSize: [50, 50],
			  iconAnchor: [5, 36],
			  popupAnchor: [20, -40]
			});
		}

		factory._zp_icon = function() {
			factory._markerLayerGroup.clearLayers();
		}

		factory.clear_layer = function() {
			factory._bikeStationMarkerGroup.clearLayers();
			factory._LayerGroup.clearLayers();
		}

		factory.getStations = function() {
			var deferr = $q.defer();
			$http({
				method: "GET",
				url: "./app/stations/stations.json"
			})
			.then(function(result){
				deferr.resolve(result);
			}, function(error){
				deferr.reject(error);
			});
			return deferr.promise;
		}

		factory.getStadistics = function(cer) {
			var deferr = $q.defer();
      var data = {
      	limit: 10,
        resource_id: 'ac80d8cf-15f4-4b15-9b98-b1451ce49acf',
        filters: {
          "Ciclo_Estacion_Retiro": cer
        }
      };

			$http({
				method: "GET",
				url: 'http://datos.labcd.mx/api/action/datastore_search',
				params:data
			})
			.then(function(result){
				deferr.resolve(result);
			}, function(error){
				deferr.reject(error);
			});
			return deferr.promise;
		}

		return factory;
	}

	angular.module('ecobici')
	.factory('factoryEcobici', factoryEcobici);

	factoryEcobici.$inject = ['$q', '$http']

})()
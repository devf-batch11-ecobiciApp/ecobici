(function(){
		'use strict';

		var map = {
			templateUrl: './app/component/map.html',
			controller: MapCtrl,
			replace:true
		}

		function MapCtrl(factoryEcobici, serviceEcobici, _, $timeout) {
			var map = this;
			var geocoder = new google.maps.Geocoder;
  		var infowindow = new google.maps.InfoWindow;
  		var _map = factoryEcobici._map_element;
			var _marker = null			
  		var _zp = null;
  		var _address = null;
  		var _colonia = null;
  		var _stations = null;
			var _bikeStationMarker = null;
			var _currentZp = null;
			var _previousZp = null;
			var _numArrives = [];
			var _numStation = [];
			var _concurrences = [];
			var count = null;
			var arrive_stations = null;
			var _firstPoint = null;
			var _secondPoint = null;
			var _polyline = null;
			var _pointList = null;
			var _polylinesGroup = new L.LayerGroup();
			var _colorLine = null;
			var _countLine = 0;
			var _distance  = null;

			factoryEcobici.map(_map);
			factoryEcobici.getStations()
			.then(function(result){
				if (result.statusText === "OK") {
					_stations = result.data.stations;					
				}
			});
	
			function clickMap(e) {
				_polylinesGroup.clearLayers();
				factoryEcobici._clearNearStationsMarkers();
				_marker = L.marker([e.latlng.lat, e.latlng.lng]);
				factoryEcobici._nearStationsGroup.addLayer(_marker);
				factoryEcobici._nearStationsGroup.addTo(_map);
				var latlng = {lat: parseFloat(e.latlng.lat), lng: parseFloat(e.latlng.lng)};
				geocoder.geocode({'location': latlng}, function(results, status) {
					if (status === "OK") {
						_address = results[0].formatted_address;
						_colonia = _address.split(", ")[1];

						_previousZp = _currentZp;
						_currentZp = _colonia;

						if(_previousZp !== _currentZp){
							factoryEcobici.clearBikeStationsGroup();
							factoryEcobici.clearDestinationStationsMarkers();
							serviceEcobici.layerIsLoading();
							_setStations(results);
						}
					}
				});
			}

			function _setStations (results) {
				if (_colonia) {
					
					if (_address.split(", ")[1] === "Centro Histórico" || _address.split(", ")[1] === "Colonia Centro") {
						_colonia = "Centro";	
					}
					if (_address.split(", ")[1] === "Escandón I Secc" || _address.split(", ")[1] === "Escandón II Secc") {
						_colonia = "Escandón";	
					}
					if (_address.split(", ")[1] === "Roma Nte.") {
						_colonia = "Roma Norte";
					}
					if (_address.split(", ")[1] === "Tlacoquemecatl del Valle") {
						_colonia = "Tlacoquemecatl";
					}
					if (_address.split(", ")[1] === "Col del Valle Centro") {
						_colonia = "Del Valle Centro";
					}
					if (_address.split(", ")[1] === "Polanco I Secc" || _address.split(", ")[1] === "Polanco II Secc" || _address.split(", ")[1] === "Polanco III Secc" || _address.split(", ")[1] === "Polanco IV Secc" || _address.split(", ")[1] === "Polanco V Secc") {
						_colonia = "Polanco";
					}

					_zp = _address.split(", ")[2].split(" ")[0];
					var near_stations = _.filter(_stations, function(a){
						return a.districtName === _colonia;
					});
					_.each(near_stations, function(b){
						$timeout(function(){
							serviceEcobici.layerIsLoaded();
							factoryEcobici._bikeStationMarker = L.marker([b.location.lat, b.location.lon], {icon: factoryEcobici.custom_icon()}).bindPopup(b.name).on('click', _markerClick);
							factoryEcobici._bikeStationsMarkerGroup.addLayer(factoryEcobici._bikeStationMarker);
							factoryEcobici._bikeStationsMarkerGroup.addTo(_map);
							if (factoryEcobici._bikeStationsMarkerGroup._leaflet_id !== undefined) {
								_map.fitBounds(factoryEcobici._bikeStationsMarkerGroup.getBounds());
							}
						},1500);

					});
				}
			}

			function _markerClick(e){
				_polylinesGroup.clearLayers();
				_firstPoint = e.latlng;
				_concurrences = [];
				factoryEcobici.clearDestinationStationsMarkers();
				factoryEcobici.getStadistics(this._popup._content.split(" ")[0])
				.then(function(result){
					_setArriveStation(result.data.result.records);
				}, function(error){
					console.log(error)
				});
			};

			function _setArriveStation(arriveStation) {
				count = _.countBy(arriveStation, "Ciclo_Estacion_Arribo");
				_.map(count, function(num, key){
					_numArrives = num;
					_numStation = key;
					arrive_stations = _.findWhere(_stations ,{id:parseInt(_numStation)});
					arrive_stations.times = _numArrives;
					_concurrences.push(arrive_stations);
					_setDestinations(_concurrences);
				});
			}

			function _setDestinations(dest) {


				_.each(dest, function(destiny){
					_countLine++;
					if(_countLine % 2 === 0){
						_colorLine = "#22ac9b";
					}
					else {
						_colorLine = "#828189";
					}
					_secondPoint = new L.LatLng(destiny.location.lat, destiny.location.lon);
					_distance = _firstPoint.distanceTo(_secondPoint); // convierto metros a kilometros
					destiny.distance = _distance / 1000;
					factoryEcobici._bikeDestinationMarker = L.marker([destiny.location.lat, destiny.location.lon], {icon: factoryEcobici.destination_icon() }).bindPopup("Arribos: "+destiny.times+", Distancia: "+destiny.distance.toFixed(1) + " km");
					factoryEcobici._bikeDestinationMarkerGroup.addLayer(factoryEcobici._bikeDestinationMarker);
					factoryEcobici._bikeDestinationMarkerGroup.addTo(_map);
					_pointList = [_firstPoint, _secondPoint];
					
					_polyline = new L.Polyline(_pointList, {
						color: _colorLine,
						weight: 2,
						opacity: 0.9,
						smoothFactor: 1,
						clickable: true
					});

				});

				_polylinesGroup.addLayer(_polyline);
				_polylinesGroup.addTo(_map);
			}

			// function _destinationMarkerClick(e){
			// 	console.log(e);
			// };

			_map.on('click', clickMap);
		}

		angular
		.module('ecobici')
		.component('map', map);
		MapCtrl.$inject = ["factoryEcobici", "serviceEcobici",  "_", "$timeout"];
})();


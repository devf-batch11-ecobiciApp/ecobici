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
			var concurrences = [];

			factoryEcobici.map(_map);
			factoryEcobici.getStations()
			.then(function(result){
				if (result.statusText === "OK") {
					_stations = result.data.stations;
				}
			});
	
			function clickMap(e) {
				factoryEcobici._zp_icon();
				_marker = L.marker([e.latlng.lat, e.latlng.lng]);
				factoryEcobici._markerLayerGroup.addLayer(_marker);
				factoryEcobici._markerLayerGroup.addTo(_map);
				var latlng = {lat: parseFloat(e.latlng.lat), lng: parseFloat(e.latlng.lng)};
				geocoder.geocode({'location': latlng}, function(results, status) {
					if (status === "OK") {
						//console.log(results)
						_address = results[0].formatted_address;
						_colonia = _address.split(", ")[1];

						_previousZp = _currentZp;
						_currentZp = _colonia;

						if(_previousZp !== _currentZp){
							factoryEcobici.clear_layer();
							_setStations(results);
							serviceEcobici.layerIsLoading();
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
							factoryEcobici._bikeStationMarkerGroup.addLayer(factoryEcobici._bikeStationMarker);
							factoryEcobici._bikeStationMarkerGroup.addTo(_map);
							if (factoryEcobici._bikeStationMarkerGroup._leaflet_id !== undefined) {
								_map.fitBounds(factoryEcobici._bikeStationMarkerGroup.getBounds());
							}
						},1500);

					});
					


				}
			}

			function _markerClick(e){
				factoryEcobici.getStadistics(this._popup._content.split(" ")[0])
				.then(function(result){
					//console.log(result);
					_setArriveStation(result.data.result.records);
				}, function(error){
					console.log(error)
				});
			};

			function _setArriveStation(arriveStation) {
				var count = _.countBy(arriveStation, "Ciclo_Estacion_Arribo");
				console.log(count);

				_.map(count, function(num, key){
					// _numArrives.push(num);
					// _numStation.push(parseInt(key));
					var arrive_stations = _.findWhere(_stations ,{id:parseInt(key)});
					console.log(arrive_stations);
				});

			}

			_map.on('click', clickMap);
		}

		angular
		.module('ecobici')
		.component('map', map);
		MapCtrl.$inject = ["factoryEcobici", "serviceEcobici",  "_", "$timeout"];
})();


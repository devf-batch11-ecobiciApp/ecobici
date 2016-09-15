( function () {
	"use strict";
	var statusApp = {
		templateUrl : "./app/component/status.html",
		controller: statusCtrl
	};


	function statusCtrl (ApiService, $q, factoryEcobici) {
		var status = this;
		var _map = factoryEcobici._map_element;
        status.stations = null;
	    ApiService.getToken()
	        .then(function (response) {
	        	if (response.data.access_token) {
	        		makeRequest(response.data.access_token);
	        	}
	        }, function(error){
	        	console.log(error)
	        });
	    var makeRequest = function(token) {
	    	
	    	ApiService.makeRequestEcobici(token)
	    	.then(function(data){
	    		console.log(data)
	    	}, function(error){
	    		console.log(error)
	    	});
	   
	    }

	}

	//statusCtrl.$inject = ["ApiService", "$q", "factoryEcobici"];

	statusApp.$inject = ["ApiService", "$q", "factoryEcobici"];
	angular
		.module("ecobici")
		.component("statusApp", statusApp);

	
})();
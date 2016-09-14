( function () {
	"use strict";
	var statusApp = {
		templateUrl : "./app/component/status.html",
		controller: statusCtrl
	};


	function statusCtrl (ApiService) {
		var status = this;
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

	statusCtrl.$inject = ["ApiService", "$q"];

	statusApp.$inject = ["ApiService"];
	angular
		.module("ecobici")
		.component("statusApp", statusApp);

	
})();
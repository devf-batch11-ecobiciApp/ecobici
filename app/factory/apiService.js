(function(){


	function ApiService($http, $q){
		var client_id = "736_2t82bwrvtk4k0csg0k0skc0kgsscckg0ssww0cgwcs44gc4ooo";
		var client_secret = "4nvdv5iu53i8gkwoowwoccc4kow4ggk0gcwskggwg40owwg4g4";
		var url = "https://pubsbapi.smartbike.com/oauth/v2/token?client_id="+client_id+"&client_secret="+client_secret+"&grant_type=client_credentials";

		var myService = {};

		myService.getToken = function() {
			var q = $q.defer();
			$http({
				method: "GET",
				url: url
			})
			.then(function (response) {
				q.resolve(response);
		
			}, function(error){
				q.reject(error);
			});

			return q.promise;
		};

		myService.makeRequestEcobici = function(token){
			var q = $q.defer();
			$http({
				method:"GET",
				url: "https://pubsbapi.smartbike.com/api/v1/stations/status.json?access_token="+token
			})
			.then(function(d) {
				q.resolve(d);
			}, function(error){
				q.reject(error)
			});

			return q.promise;
		};

		return myService;
	}


	ApiService.$inject = ['$http', '$q'];

	angular.module('ecobici')
	.service('ApiService', ApiService);

})();
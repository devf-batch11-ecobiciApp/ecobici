(function () {
	'use strict';

	function serviceEcobici ($q, $http) {

		this.loaderTemplate = [
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
		this.layerIsLoading = function(){
			return angular.element(document.getElementsByTagName("body")).append(this.loaderTemplate);
		};

		this.layerIsLoaded = function(){
			return angular.element(document.getElementsByClassName('m-loading')).remove();
		};
	}

	angular.module('ecobici')
	.service('serviceEcobici', serviceEcobici);

	serviceEcobici.$inject = ['$q', '$http']

})()
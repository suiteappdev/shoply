'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:uploader
 * @description
 * # uploader
 */
angular.module('shoplyApp')
  .directive('uploader', ["api", "modal", function (api, modal, $window) {
  	function ctrl($scope){
		$scope.load = function(){

		};

		$scope.doCrop = function(){
			$scope.$$childHead.$close()
		}		
  	}

    return {
      restrict: 'A',
      scope : {
      	ngModel : '=',
      	crop : '='
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {
		var _element = angular.element(element);

		_element.on('change', function(evt){
			scope.$apply(function(){
			  		var _formData = new FormData();

			  		_formData.append('file', evt.currentTarget.files[0]);
			  		scope.loading = true;

			  		api.upload().post(_formData, { transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(res){
			  			scope.ngModel = res;
			  			scope.loading = false;
				  			if(scope.crop){
							      modal.show({templateUrl : 'views/utils/cropper.html', size :'md', scope: scope}, function($scope){

							      });
				  			}
			  			
			  		});
				});
			});
		}
	}
  }]);

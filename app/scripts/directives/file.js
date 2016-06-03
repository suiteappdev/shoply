'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:file
 * @description
 * # file
 */
angular.module('shoplyApp')
  .directive('file', function () {
	function link($scope, $element, $attr, api){
		var _element = angular.element($element);
		
		 var _files = [];

		_element.on('change', function(evt){
			$scope.$apply(function(){
				if($scope.single){
					$scope.ngModel = evt.currentTarget.files[0];
				}else{
					for (var i = 0; i < evt.currentTarget.files.length; i++) {
						_files.push(evt.currentTarget.files[i]);
					};

					$scope.ngModel = _files;

				}
			});
		});

	}

	return {
		restrict : "A",
		scope : {
			ngModel : "=",
			single  : "="
		},
		link : link
	}
  });

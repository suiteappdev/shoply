'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:uploader
 * @description
 * # uploader
 */
angular.module('shoplyApp')
  .directive('imageUploader', ["api", "modal", function (api, modal, $window, $timeout) {
  	function ctrl($scope){

  		$scope.image_final = '';
  		$scope.ghost = [];

		$scope.load = function(){

		};

		$scope.show = function(){
			$scope.file = this.file.preview;

		    modal.show({templateUrl : 'views/utils/preview.html', size :'md', scope: $scope}, function($scope){
		        $scope.$close();
		    });
		}

		$scope.remove = function(){
			$scope.ngModel.splice($scope.ngModel.indexOf(this.file));
		};

		$scope.edit = function(){
			$scope.editImage = this.file;

		    modal.show({templateUrl : 'views/utils/cropper2.html', size :'md', scope: $scope}, function($scope){
	  			$scope.editImage.loading = true;

		  		api.s3().post({data : $scope.image_final}).then(function(res){
		  			if(res){
		  				$scope.editImage.loading = false;
		  				$scope.udate = new Date();
		  				$scope.editImage.URL = res.data.url;
		  				
		  				$scope.$apply();
		  			}
		  		}, function(error){

		  		});

		        $scope.$close();
		    });
		};
  	}

    return {
      restrict: 'EA',
      templateUrl : 'views/utils/uploader.html',
      scope : {
      	ngModel : '=',
      	buttonText : '@',
      	area : '@',
      	title : "@",
      	label : '@',
      	items : '='
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {
		var _element = angular.element(element).find("#file");

		_element.on('change', function(evt){
			scope.$apply(function(){
					scope.files = evt.currentTarget.files;

					angular.forEach(scope.files, function(f){
	          			var reader = new FileReader();

				        reader.onload = function (evt) {
				           f.preview = evt.target.result;
				           f.udate = new Date();
				           f.aname = f.name; 
	          			   scope.ghost.push(f);
				    
				           scope.$apply();
				        };

          				reader.readAsDataURL(f);
					});

					scope.ngModel = scope.ghost;
				});
			});
		}
	}
  }]);

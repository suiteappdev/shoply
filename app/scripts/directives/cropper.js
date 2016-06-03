angular.module("shoplyApp").directive("cropArea", function($rootScope, $timeout){
	function ctrl($rootScope, $scope , modal){

	}

	function link($scope, $element, $attr){
		$timeout(function(){
			var image = document.getElementById('toCrop');
			var cropper = new Cropper(image, {
			  aspectRatio: 16 / 9,
			  crop: function(e) {
			  	$scope.$apply(function(){
				  	$scope.ngModel = e.detail;
			  	})
			  }
			}); 			
		});
	}

	return {
		restrict : "A",
		controller : ctrl,
		scope : {
			ngModel : "="
		},
		replace : false,
		link : link
	}
});
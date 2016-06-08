angular.module("shoplyApp").directive("cropper", function($rootScope, $timeout){
	function link($scope, $element, $attr){
        var handleFileSelect=function(evt) {
	          var file = evt.currentTarget.files[0];
	          var reader = new FileReader();
	          $scope.isLoaded = false;
	          
	          reader.onload = function (evt) {
		            $scope.$apply(function($scope){
		              	$scope.myImage = evt.target.result;
		              	$scope.isLoaded = true;
		            });
	          };

          	reader.readAsDataURL(file);
        };	

        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
	}

	return {
		restrict : "EA",
		template:'<div><div ng-show="!isLoaded" ><input type="file" id="fileInput" class="hidden"><label style="width: 100%;float: left;position: relative;height: 350px;line-height: 7; font-size: 50px;" for="fileInput" class="text-center custom-btn custom-btn-primary"><i class="icon icon-picture"></i> Subir</label></div><div ng-show="isLoaded" class="cropArea"><img-crop image="myImage" result-image="ngModel"></img-crop></div></div>',
		scope : {
			ngModel : "="
		},
		replace : true,
		link : link
	}
});
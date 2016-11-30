'use strict';

angular.module('shoplyApp')
  .directive('clienteField', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.user().get().success(function(res){
  			$scope.records = res.filter(function(_o){
          _o.full_name = _o.name +" "+ _o.last_name;
          return _o.type == "CLIENT";
        });
  		});

  		$scope.myConfig = {
        loadingClass: 'selectizeLoading',
        create : false,
  		  valueField: $scope.key,
       // maxOptions : 1,
  		  labelField: $scope.label,
  		  placeholder: 'Cliente',
        openOnFocus : false,
        selectOnTab : true,
        maxItems: 1
  		};

  	}

    return {
      template: '<selectize focus-on="true" config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=ngModel",
        key : "@",
        label : "@",
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });
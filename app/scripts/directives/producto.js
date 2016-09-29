'use strict';

angular.module('shoplyApp')
  .directive('productoField', function () {
  	function ctrl($scope, api, modal, $rootScope){
  		api.producto().get().success(function(res){
  			$scope.records = res.map(function(o){
          var _obj = new Object();
              _obj = o.data;
              _obj.iva = o._iva;
              _obj._reference = o._reference;
              _obj._category = o._category;
              _obj._id = o._id;
              _obj.idcomposed = o.idcomposed;
              _obj.refMixed = o._reference.reference.join("");

              return _obj; 
        }) || [];

  		});
      
  		$scope.myConfig = {
        loadingClass: 'selectizeLoading',
        create:false,
  		  valueField: $scope.key,
  		  labelField: $scope.label,
  		  placeholder: 'Producto',
        maxItems: 1,
        searchField : $scope.searchBy,
        maxOptions : 1,
        openOnFocus : false,
        selectOnTab : true,
        setFocus : $scope.setFocus,
        render: {
              option: function(item, escape) {
                  return '<div><img style="border:2px solid #efefef;width:50px;height:50px;margin-right:5px;" src="'+item.gallery[0].URL+'" />' +
                         '<span>'+escape(item.producto)+'</span></div>'
              }
        },

        onItemAdd : function(value, $item){
          angular.forEach($scope.records, function(v, k){
            if(v._id == value){
              $scope.setObject = $scope.records[k];
              return;
            }
          });

        }
  		};

  	}

    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        setObject:"=",
        setFocus : "=",
        key : "@",
        label : "@",
        searchBy:"="
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
        element[0].firstChild.selectize.focus();
      }
    };
  });
'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RequestCtrl
 * @description
 * # RequestCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RequestCtrl', function ($scope, constants, api, $state, modal) {
  	$scope.request_status = constants.request_status;

  	$scope.load = function(){
  		window.socket.on('request', function(data){
  			
  			toastr.options.onclick = function(){
  				$state.go('dashboard.detalle_pedido', {pedido:data._id});
  			};

			toastr.success('ha llegado un nuevo pedido', {timeOut: 10000});
			api.pedido(data._id).get().success(function(res){
				$scope.records.push(res);
			});
  		});

  		api.pedido().get().success(function(res){
  			$scope.records = res || [];
  		});
  	}

  	$scope.delete = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
			  		api.pedido(_record._id).delete().success(function(res){
			            sweetAlert("Correcto", "Se ha eliminado este registro", "success");
                        $scope.records.splice($scope.records.indexOf(_record), 1);
			  		});
               }
           })
  	}
	
	$scope.myConfig = {
	  valueField: 'status',
	  labelField: 'status',
	  placeholder: 'Estado',
	  onInitialize: function(selectize){
	    // receives the selectize object as an argument
	  },
	  maxItems: 1
	};
  });

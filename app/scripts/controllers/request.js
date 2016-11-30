'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RequestCtrl
 * @description
 * # RequestCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RequestCtrl', function ($scope, $window,$timeout, constants, api, $state, modal, $rootScope) {
    $scope.request_status = constants.request_status;
    $scope.Records = false;
    
    $rootScope.$on("incoming_request", function(event, data){
      $scope.records.push(data);
    });

    $scope.load = function(){
      api.pedido().get().success(function(res){
          $scope.records = res || [];
          $scope.Records = true;          
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

    $scope.detail = function(){
      $state.go('dashboard.detalle_pedido', {pedido: this.record._id});
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

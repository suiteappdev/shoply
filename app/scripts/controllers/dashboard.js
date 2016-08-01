'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('DashboardCtrl', function ($scope, api, modal, storage, $state, $rootScope, $timeout) {
  	
    $scope.load = function(){
      if(!$rootScope.user._company){
         modal.show({templateUrl : 'views/company/conectar.html', size :'md', scope: $scope}, function($scope){
            var _user = $rootScope.user;
            $scope.loading = true;
            
            api.empresa($scope._company).get().success(function(res){
              $timeout(function(){
                $rootScope.user._company = res;
                storage.update('user', $rootScope.user);
                toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                $scope.loading = false;
                $scope.$close();
              }, 5000);
            });       
         });        
      }
  	}

    $scope.agregarIva = function(){
       modal.show({templateUrl : 'views/iva/agregar_ivas.html', size :'md', scope: $scope}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarFormasDePago = function(){
       modal.show({templateUrl : 'views/formaDePago/agregar_formaDePago.html', size :'md', scope: $scope}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarConsecutivo = function(){
       modal.show({templateUrl : 'views/contador/agregar_contadores.html', size :'md', scope: $scope}, function($scope){
          $scope.$close();
       });  
    }
  });

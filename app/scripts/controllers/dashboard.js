'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('DashboardCtrl', function ($scope, api, modal, storage, $state, $rootScope, $timeout, permission) {
  	
    $scope.load = function(){
      if(angular.fromJson(localStorage.company)){
          $rootScope.user._company = angular.fromJson(localStorage.company);
      }
  	}

    $scope.rememberCompany = function(remenber){
        if(remenber){
          storage.save('remenberCompany', company);
          return;
        }

        storage.delete('remenberCompany');
    } 

    $scope.cambiarEmpresa = function(){
         modal.show({templateUrl : 'views/company/conectar.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
            var _user = $rootScope.user;
            $scope.loading = true;
            api.empresa($scope.company._id).get().success(function(res){
              $timeout(function(){
                $rootScope.user._company = res;
                storage.update('user', $rootScope.user);
                
                if($scope.form && $scope.form.data.remenber){
                  storage.save('company', res);
                }
                //$scope.$parent.remenberCompany('company', res);
                toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                $scope.loading = false;
                $scope.$close();
              }, 5000);
            });     
         });        
    }

    $scope.agregarIva = function(){
       modal.show({templateUrl : 'views/iva/agregar_ivas.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarFormasDePago = function(){
       modal.show({templateUrl : 'views/formaDePago/agregar_formaDePago.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarConsecutivo = function(){
       modal.show({templateUrl : 'views/contador/agregar_contadores.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
       });  
    }
  });

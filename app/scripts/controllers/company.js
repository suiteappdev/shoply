'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CompanyCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

    $scope.load = function(){
      api.empresa().add("user/" + angular.fromJson(storage.get("user"))._id).get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
  	}

    $scope.connectCompany = function(){
        $scope.company = this.record;
         modal.show({templateUrl : 'views/company/conectar.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
            var _user = $rootScope.user;
            $scope.loading = true;
            
            api.empresa($scope.company._id).get().success(function(res){
              $timeout(function(){
                $rootScope.user._company = res;
                storage.update('user', $rootScope.user);
                toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                $scope.loading = false;
                $state.go('dashboard');
                $scope.$close();
              }, 5000);
            });       
         });   
    }

  	$scope.agregar = function(){
       modal.show({templateUrl : 'views/company/agregar_empresa.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEmpresa.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.empresa().post(angular.extend($scope.form, { _user : angular.fromJson(window.localStorage.user)._id})).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado una nueva empresa.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      modal.show({templateUrl : 'views/company/editar_empresa.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarEmpresa.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.empresa($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.form.data;
                }
            });
      });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.empresa(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });

'use strict';

angular.module('shoplyApp')
  .controller('RouteCtrl', function ($scope, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.rutas().get().success(function(res){
        $scope.records =  res || [];

        $scope.Records = true;
      });
  	}

  	$scope.agregar = function(){
       modal.show({templateUrl : 'views/rutas/agregar-ruta.html', size :'md', scope: $scope}, function($scope){
            if($scope.formRuta.$invalid){
                 modal.incompleteForm();
                return;
            }
            
            api.rutas().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado un nuevo vendedor.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      delete $scope.formEdit.password;
      
      modal.show({templateUrl : 'views/vendedores/editar_vendedor.html', size :'md', scope: $scope}, function($scope){
            if($scope.vendedorForm.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                }
            });
      });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.rutas(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });

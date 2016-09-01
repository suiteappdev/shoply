'use strict';

angular.module('shoplyApp')
  .controller('employeCtrl', function ($scope,$timeout, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.user().get().success(function(res){
          $scope.records = res.filter(function(_o){
              return _o.type == "EMPLOYE";
          });     
          $scope.Records = true;
      });
  	}

  	$scope.agregar = function(){
       modal.show({templateUrl : 'views/empleado/agregar_empleado.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEmploye.$invalid){
                 modal.incompleteForm();
                return;
            }
            
            $scope.form.type = "EMPLOYE";
            api.user().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado un nuevo empleado.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._route = $scope.formEdit._route.map(function(_o){return _o._id});
      $scope.formEdit._permission = $scope.formEdit._permission ? $scope.formEdit._permission._id : null;
      delete $scope.formEdit.password;
      
      modal.show({templateUrl : 'views/empleado/editar_empleado.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditEmploye.$invalid){
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
                    api.user(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });

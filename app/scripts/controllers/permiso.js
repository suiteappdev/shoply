'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('PermisoCtrl', function ($scope, $window, $rootScope, sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

  $scope.menus = $window.permisos.menus;
  $scope.forms = $window.permisos.forms;

  $scope.$watch('form.data._menu', function(n, o){
    $scope.formsCollection = angular.copy($scope.forms.filter(function(obj){
      return obj.parent == n;
    }));
  });

  $scope.$watch('formEdit.data._menu', function(n, o){
    $scope.formsCollectionEdit = angular.copy($scope.forms.filter(function(obj){
      return obj.parent == n;
    }));
  }); 


    $scope.load = function(){
      api.permiso().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });    
  	}

    $scope.addMenu = function(){
      /*var _exist = false;

      if($scope.permission){
        angular.forEach($scope.permission, function(o){
          if($scope.form.data._form == o._form){
            _exist = true;
          }
        });
      }

      if(_exist){
        sweetAlert.swal("Registro Duplicado", "No puedes agregar 2 permisos a un solo formulario", "warning");
        return;
      }*/

      if(!$scope.permission){
        $scope.permission = [];
        $scope.permission.push(angular.copy($scope.form.data));
      }else{
        $scope.permission.push(angular.copy($scope.form.data));
      }
    }

    $scope.addMenuEdit = function(){
      /*var _exist = false;

      if($scope.formEdit.data.permission){
        angular.forEach($scope.formEdit.data.permission, function(o){
          if($scope.formEdit.data._form == o._form){
            _exist = true;
          }
        });
      }

      if(_exist){
        sweetAlert.swal("Registro Duplicado", "No puedes agregar 2 permisos a un solo formulario", "warning");
        return;
      }*/

      $scope.formEdit.data.permission.push({_menu : $scope.formEdit.data._menu, access: $scope.formEdit.data.access, _form:$scope.formEdit.data._form});
    }

  	$scope.agregar = function(){
       modal.show({templateUrl : 'views/permisos/agregar_permiso.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.permisoForm.$invalid){
                 modal.incompleteForm();
                return;
            }

            $scope.formData = new Object();
            $scope.formData.data = new Object();
            $scope.formData.data.permission = $scope.permission;
             
           sweetAlert.swal({
              title: "",
              type: "input",
              showCancelButton: false,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Perfil" 
            }, function(inputValue){
                $scope.formData.data.profile = inputValue;
                
                api.permiso().post($scope.formData).success(function(res){
                  if(res){
                    sweetAlert.swal("Registro completado.", "Has creado un nuevo perfil.", "success");
                    $scope.$close();
                    $scope.load();
                    delete $scope.permission;
                    delete $scope.formData;
                    window.swal.close();   
                  }
                });
            });  
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
       
      console.log($scope.formEdit);

      modal.show({templateUrl : 'views/permisos/editar_permiso.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarPermiso.$invalid){
                 modal.incompleteForm();
                return;
            }

           sweetAlert.swal({
              title: "",
              type: "input",
              inputValue : $scope.formEdit.data.profile,
              showCancelButton: false,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Perfil" 
            }, function(inputValue){
                $scope.formEdit.data.profile = inputValue;
                delete $scope.formEdit.data._menu;
                delete $scope.formEdit.data._form;
                delete $scope.formEdit.data.access;
                api.permiso($scope.formEdit._id).put($scope.formEdit).success(function(res){
                    if(res){
                        sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                        $scope.$close();
                        delete $scope.formEdit.data;
                        $scope.load();
                    }
                });
            });  

      });
    }

    $scope.removeFromList = function(){
        var _record = this.record;
        console.log(_record);

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
             $scope.formEdit.data.permission.splice($scope.formEdit.data.permission.indexOf(_record), 1);
              $scope.$apply();
           })
    } 

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.permiso(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });

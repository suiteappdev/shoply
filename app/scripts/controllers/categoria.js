'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CategoriaCtrl', function ($scope, modal, api) {
    $scope.Records = false; 
    
    $scope.load = function(){
      api.categoria().get().success(function(res){
        $scope.records = res;
        $scope.Records = true;
      });
    };

    $scope.addIcon = function(){
       modal.show({templateUrl : 'views/categorias/agregar-icono.html', size :'md', scope: $scope}, function($scope){

        });
    }

    $scope.setIcon = function(){
      console.log(this);
    }

    $scope.agregar = function(){
       modal.show({templateUrl : 'views/categorias/agregar-categoria.html', size :'md', scope: $scope}, function($scope){
            if($scope.formCategoria.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.categoria().post(angular.extend($scope.form, {id : $scope.form.text})).success(function(res){
                if(res){
                  $scope.records.push(res);
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
                    api.categoria(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._category = this.record

      modal.show({templateUrl : 'views/categorias/editar_categoria.html', size :'md', scope: $scope}, function($scope){
            if($scope.formEditCategoria.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.categoria($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                }
            });
      });
    }

  });

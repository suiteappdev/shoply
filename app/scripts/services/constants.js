'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.constants
 * @description
 * # constants
 * Constant in the shoplyApp.
 */
angular.module('shoplyApp')
  .constant('constants', {
  	base_url : "http://192.168.1.1:8080/api/",
    socket : "http://192.168.1.1:8080",                          
  	login_state_sucess : 'dashboard',
    uploadURL : "http://192.168.1.1:8080/api/uploads",
    uploadFilesUrl : "http://192.168.1.1:8080/uploads/",
    base_resource : "http://192.168.1.1:8080/api/resource/",
  	currency  : 'COP',
  	iva : [{valor :5, text : "5%"}, {valor :10, text : "10%"}],
  	request_status : [{status : "Despachado"}  ,{status : "Recibido"},{status:"Pendiente"},{ status : "Observación"}],
  	product_status : [{status : "Habilitado"}, {status : "Inhabilitado"}],
  	enable_social_auth : false
  });
 
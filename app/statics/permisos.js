window.permisos = {
	menus : [{"nombre":"Ajustes","id":"mnuAjustes"},
			 {"nombre":"Permisos","id":"mnuPermisos"},
			 {"nombre":"Usuarios","id":"mnuUsuarios"},
			 {"nombre":"Productos","id":"mnuProductos"},
			 {"nombre":"Permisos","id":"mnuPermisos"},
			 {"nombre":"Rutas","id":"mnuRutas"},
			 {"nombre":"Categorias","id":"mnuCategorias"},
			 {"nombre":"Pedidos","id":"mnuPedidos"},
			 {"nombre":"Facturacion","id":"mnuFacturacion"},
			 {"nombre":"Arqueos","id":"mnuArqueos"},
			 {"nombre":"Apps","id":"mnuApps"},
			 {"nombre":"Empresa","id":"mnuEmpresas"},
			 {"nombre":"Devoluciones","id":"mnuDevoluciones"}
				],

	forms  : [			{"parent":"mnuAjustes","nombre":"Ivas", "id":"frmIvas"},
						{"parent":"mnuAjustes","nombre":"Formas de Pago", "id":"frmFormaPagos"},
						{"parent":"mnuAjustes","nombre":"Consecutivos", "id":"frmConsecutivos"},
						{"parent":"mnuUsuarios","nombre":"Usuarios", "id":"frmUsuarios"},
						{"parent":"mnuUsuarios","nombre":"Empleados", "id":"frmEmpleados"},
						{"parent":"mnuUsuarios","nombre":"Vendedores", "id":"frmVendedores"},
						{"parent":"mnuFacturacion","nombre":"Nueva Facturacion", "id":"frmNuevaFacturacion"},
						{"parent":"mnuFacturacion","nombre":"Buscar Facturacion", "id":"frmBuscarFacturacion"},
						{"parent":"mnuFacturacion","nombre":"Devoluciones", "id":"frmDevoluciones"}
					]
}
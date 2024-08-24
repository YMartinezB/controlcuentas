document.addEventListener('DOMContentLoaded', function () {
    const formCuenta = document.getElementById('formCuenta');
    const tablaCuentas = document.getElementById('tablaCuentas').getElementsByTagName('tbody')[0];

    // Cargar cuentas guardadas al iniciar
    cargarCuentas();

    // Manejar la sumisión del formulario
    formCuenta.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const nuevaCuenta = {
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaFin: document.getElementById('fechaFin').value
        };

        guardarCuenta(nuevaCuenta);
        mostrarCuentaEnTabla(nuevaCuenta);
        formCuenta.reset();
    });

    // Guardar cuenta en almacenamiento local
    function guardarCuenta(cuenta) {
        let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
        cuentas.push(cuenta);
        localStorage.setItem('cuentas', JSON.stringify(cuentas));
    }

    // Cargar cuentas desde almacenamiento local y mostrarlas en la tabla
    function cargarCuentas() {
        let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
        cuentas.forEach(mostrarCuentaEnTabla);
        verificarAlertas();
    }

    // Mostrar una cuenta en la tabla
    function mostrarCuentaEnTabla(cuenta) {
        const fila = tablaCuentas.insertRow();
        fila.insertCell(0).textContent = cuenta.email;
        fila.insertCell(1).textContent = cuenta.nombre;
        fila.insertCell(2).textContent = cuenta.telefono;
        fila.insertCell(3).textContent = cuenta.fechaInicio;
        fila.insertCell(4).textContent = cuenta.fechaFin;

        // Calcular la diferencia en días entre la fecha de inicio y finalización
        const fechaInicio = new Date(cuenta.fechaInicio);
        const fechaFin = new Date(cuenta.fechaFin);
        const hoy = new Date();

        let diferenciaDias = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
        let textoDias = diferenciaDias >= 0 ? `Quedan ${diferenciaDias} días` : `Vencido por ${Math.abs(diferenciaDias)} días`;

        fila.insertCell(5).textContent = textoDias; // Mostrar la diferencia de días
        
        // Añadir botón de eliminar
         const btnEliminar = document.createElement('button');
         btnEliminar.textContent = 'Eliminar';
         btnEliminar.addEventListener('click', function () {
             eliminarCuenta(cuenta, fila);
         });
         fila.insertCell(6).appendChild(btnEliminar);

         // Eliminar una cuenta de la tabla y de localStorage
        function eliminarCuenta(cuenta, fila) {
        fila.remove(); // Elimina la fila de la tabla
        
        let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
        cuentas = cuentas.filter(c => c.email !== cuenta.email); // Filtrar la cuenta que se va a eliminar
        localStorage.setItem('cuentas', JSON.stringify(cuentas)); // Actualizar localStorage
    }
    }

    // Verificar si alguna cuenta está por finalizar y enviar alerta
    /* function verificarAlertas() {
        const hoy = new Date().toISOString().split('T')[0];
        let cuentas = JSON.parse(localStorage.getItem('cuentas')) || [];
        
        cuentas.forEach(cuenta => {
            if (cuenta.fechaFin === hoy) {
                alert(`La suscripción de ${cuenta.nombre} (Correo: ${cuenta.email}) finaliza hoy.`);
                
                // Enviar correo de alerta
                emailjs.send("service_59c3nek", "service_59c3nek", {
                    to_email: "yuimart13@gmail.com", // El correo donde quieres recibir las alertas
                    from_name: "Gestión de Cuentas de Streaming",
                    message: `La suscripción de ${cuenta.nombre} con el correo ${cuenta.email} finaliza hoy.`
                }).then((response) => {
                    console.log("Correo enviado con éxito!", response.status, response.text);
                }, (error) => {
                    console.error("Error al enviar el correo:", error);
                });
            }
        });
    } */
});

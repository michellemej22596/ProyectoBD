# ProyectoBD
Michelle Mejía 22596 y  Silvia Illescas 22376
# ProyectoBD
Michelle Mejía 22596 y  Silvia Illescas 22376

Plataforma de Gestión para Restaurantes
La Plataforma de Gestión para Restaurantes es una aplicación completa desarrollada utilizando Node.js, Express y PostgreSQL. Proporciona una solución integral para la gestión de pedidos, cocina, bar, cuentas y generación de informes en restaurantes, junto con una API para la integración con otros sistemas.

Descripción
Esta plataforma ofrece una serie de características clave que incluyen:

- Autenticación segura para usuarios del servicio.
- Toma de pedidos para meseros, con la capacidad de abrir cuentas y agregar elementos del menú solicitados por los clientes.
- Pantallas dedicadas para la cocina y el bar que muestran los pedidos pendientes ordenados por hora de ingreso.
- Generación de informes detallados, como pedidos y facturas, para una gestión eficiente del restaurante.
- Funcionalidades de informes para analizar el rendimiento del restaurante, como los platos más pedidos, horarios de mayor demanda y         promedio de tiempo de consumo.
- API para integración con otros sistemas, lo que permite la expansión y personalización de la plataforma.

Características Principales
Autenticación y Autorización Seguras: Los usuarios pueden registrarse e iniciar sesión de forma segura, con contraseñas encriptadas almacenadas en la base de datos.

Toma de Pedidos: Los meseros pueden registrar pedidos, abrir cuentas y agregar platos y bebidas solicitadas por los clientes.

Pantallas de Cocina y Bar: Mostrar listados de platos y bebidas pendientes para preparar en la cocina y el bar, respectivamente, ordenados por hora de ingreso.

Impresión de Pedidos y Facturas: Generar informes de pedidos para que los clientes los revisen, así como facturas una vez que las cuentas están cerradas.

Funcionalidades de Informes: Ofrece una variedad de informes para analizar el rendimiento del restaurante, incluyendo platos más pedidos, horarios de mayor demanda, promedio de tiempo de consumo, quejas y eficiencia de los meseros.

API Integrada: La plataforma incluye una API para integración con otros sistemas, lo que permite una mayor flexibilidad y personalización.


Requisitos de Instalación
Node.js y npm instalados en el sistema.
Servidor PostgreSQL configurado y ejecutándose.
Clonar este repositorio desde GitHub.

Configuración
Ejecutar npm install en las carpetas server y client para instalar las dependencias.
Configurar las variables de entorno en el servidor para la conexión a la base de datos PostgreSQL.
Ejecutar el script schema.sql en la base de datos para crear las tablas necesarias.

Uso
Iniciar el servidor ejecutando npm start en la carpeta server.
Iniciar el cliente ejecutando npm run dev en la carpeta client.
Acceder a la aplicación desde el navegador web en la dirección http://localhost:5173.

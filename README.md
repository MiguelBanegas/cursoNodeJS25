# API de Monitoreo con Autenticación JWT

Una API RESTful construida con Node.js y Express para el monitoreo de mediciones (temperatura y humedad) enviadas por distintos dispositivos (IoT). 
Incluye un sistema completo de autenticación y autorización basado en JSON Web Tokens (JWT), con gestión de usuarios y roles. La base de datos utilizada es Firestore.

## Características

- CRUD completo para mediciones.
- Sistema de autenticación con registro y login, con verificacion de email y cambio de contraseña.
- Autorización basada en roles (`admin`, `user`, `test`).
- Endpoints protegidos mediante middleware JWT.
- CRUD de usuarios para administradores.

## Prerrequisitos

- Node.js (v18 o superior)
- npm

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd monitoreoNodeJS
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Configuración

1.  Crea un archivo `.env` en la raíz del proyecto. Puedes renombrar o copiar el archivo `.env.example` como plantilla.

2.  Rellena las variables de entorno con tus credenciales de Firebase y un secreto para JWT. El secreto debe ser una cadena larga y aleatoria.

    ```
    # .env
    apiKey=TU_API_KEY_AQUI
    authDomain=TU_AUTH_DOMAIN_AQUI
    projectId=TU_PROJECT_ID_AQUI
    storageBucket=TU_STORAGE_BUCKET_AQUI
    messagingSenderId=TU_MESSAGING_SENDER_ID_AQUI
    appId=TU_APP_ID_AQUI
    measurementId=TU_MEASUREMENT_ID_AQUI
    PORT=3000
    JWT_SECRET=TU_SECRETO_SUPER_SECRETO_Y_LARGO_AQUI
    JWT_EXPIRES_IN= #eejmplo 1h (1 hora, puedes cambiarlo según tus necesidades)
    RESEND_API_KEY=tu_resend_api_key_aqui  # Clave de API para Resend
    ```

## Iniciar la Aplicación

Para ejecutar el servidor, utiliza el siguiente comando:

```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000` o segun la variable de entorno del servidor.

## Endpoints de la API

Todos los endpoints están prefijados con `/api/v1`.

### Autenticación (`/auth`)

**`POST /auth/register`**  
`https://curso-node-js-25.vercel.app/api/v1/auth/register`  
Registra un nuevo usuario. El primer usuario registrado obtiene automáticamente el rol de `admin`.

*   **Body (JSON):**
    ```json
    {
        "nombre": "Nombre de Usuario",
        "email": "usuario@ejemplo.com",
        "password": "password123"
    }
    ```
**`POST /auth/verify-code`**  
`https://curso-node-js-25.vercel.app/api/v1/auth/verify-code`  
Se ingresa el email y codigo que fue enviado al email registrado, para darlo como valido

*   **Body (JSON):**
    ```json
    {
        "email": "usuario@ejemplo.com",
        "code": "123456"
    }
    ```

**`POST /auth/login`**  
`https://curso-node-js-25.vercel.app/api/v1/auth/login`  
Inicia sesión y devuelve un token JWT válido por 1 hora.

*   **Body (JSON):**
    ```json
    {
        "email": "usuario@ejemplo.com",
        "password": "password123"
    }
    ```
*   **Respuesta (200):**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
**`POST /auth/reset-password`**  
`https://curso-node-js-25.vercel.app/api/v1/auth/reset-password`  
Se ingresa el email y nueva contraseña.

*   **Body (JSON):**
    ```json
    {
        "email": "usuario@ejemplo.com",
        "newPassword": "123456"
    }
    ```

### Usuarios (`/users`)

*Requiere autenticación (Bearer Token).

**`GET /users/profile`**  
`https://curso-node-js-25.vercel.app/api/v1/users/profile`  

-   Obtiene el perfil del usuario autenticado. Ideal para probar un token.
-   **Permisos:** Cualquier usuario autenticado.

**`GET /users`**  
`https://curso-node-js-25.vercel.app/api/v1/users`  
-   Obtiene una lista de todos los usuarios.
-   **Permisos:** `admin`.

**`GET /users/:id`**  
`https://curso-node-js-25.vercel.app/api/v1/users/:id`  

-   Obtiene un usuario específico por su ID.
-   **Permisos:** `admin` (cualquier usuario), `user` (solo su propio perfil).

**`PUT /users/:id`**  
`https://curso-node-js-25.vercel.app/api/v1/users/:id`  

-   Actualiza un usuario.
-   **Permisos:** `admin` (puede cambiar `nombre`, `email`, `rol`), `user` (solo su `nombre` y `email`).
-   **Body (JSON):**
    ```json
    {
        "nombre": "Nuevo Nombre",
        "rol": "test"
    }
    ```

**`DELETE /users/:id`**  
`https://curso-node-js-25.vercel.app/api/v1/users/:id`  
-   Elimina un usuario.
-   **Permisos:** `admin`.

**`PUT /users/:id/password`**  
`https://curso-node-js-25.vercel.app/api/v1/users/:id/password`  

- Ejemplo: `/lsDZ2LH0oLZWwRFDTLIl/password`
-   Cambia la contraseña de un usuario específico.
-   **Esta acción genera un registro de auditoría.**
-   **Permisos:** `admin`.
-   **Body (JSON):**
    ```json
    {
        "password": "nuevaPasswordSegura123"
    }
    ```

### Auditoría

El sistema registra acciones críticas en una colección de Firestore llamada `audit_logs` para fines de seguridad y trazabilidad.

**Colección:** `audit_logs`

Cada vez que un administrador realiza una acción sensible, como cambiar la contraseña de un usuario, se crea un nuevo documento en esta colección.

**Ejemplo de Registro de Auditoría (Cambio de Contraseña):**

```json
{
    "action": "ADMIN_PASSWORD_CHANGE",
    "adminId": "idDelAdminQueHizoElCambio",
    "adminEmail": "admin@ejemplo.com",
    "targetUserId": "idDelUsuarioAfectado",
    "targetUserEmail": "usuario@ejemplo.com",
    "timestamp": "2023-10-27T10:00:00.000Z"
}
```


### Mediciones (`/mediciones`)
`https://curso-node-js-25.vercel.app/api/v1/mediciones`  
*Requiere autenticación (Bearer Token) y rol `user` o `admin`.*

- **`GET /`**  
  Devuelve un Json con todas las mediciones.

### Obtener una medición por ID

- **GET** `/id/:id`  
  `https://curso-node-js-25.vercel.app/api/v1/mediciones/id/lsDZ2LH0oLZWwRFDTLIl`  
- Ejemplo: `/id/lsDZ2LH0oLZWwRFDTLIl`
- Devuelve Json con el item con el ID especificado.

### Buscar mediciones

- **GET** `/search?search=valor`  
  `https://curso-node-js-25.vercel.app/api/v1/mediciones/search?search=esp32`  
- Busca mediciones por `idDisp`, `temp` o `hum` que incluyan el valor indicado, devuelve un Json.

### Crear una nueva medición

- **POST** `/`  
  `https://curso-node-js-25.vercel.app/api/v1/mediciones`  
- Enviar un JSON en el body con los datos de la medición:
  ```json
  {
    "idDisp": "esp32-1",
    "temp": 25,
    "hum": 90
  }
  ```
- Devuelve la medición creada.

### Actualizar una medición

- **PUT** `/id/:id`  
  `https://curso-node-js-25.vercel.app/api/v1/mediciones/id/lsDZ2LH0oLZWwRFDTLIl`  
- Ejemplo: `/id/lsDZ2LH0oLZWwRFDTLIl`
- Enviar un JSON en el body con los campos a modificar (por ejemplo, `temp` o `hum`): (solo Admin)
  ```json
  {
    "temp": 30
  }
  ```
- Devuelve Json con la medición actualizada.

### Eliminar una medición

- **DELETE** `/id/:id`  
  `https://curso-node-js-25.vercel.app/api/v1/mediciones/id/lsDZ2LH0oLZWwRFDTLIl`  
- Ejemplo: `/id/lsDZ2LH0oLZWwRFDTLIl`
- Elimina la medición con el ID especificado. (solo Admin)
- Devuelve un Json con mensaje de confirmación y la medición eliminada.



### Roles de Usuario

-   **`admin`**: Acceso total. Puede gestionar todos los usuarios y mediciones.
-   **`user`**: Puede gestionar mediciones y ver/actualizar su propio perfil.
-   **`test`**: Rol de ejemplo sin permisos específicos, puede ser asignado por un `admin`.

### NOTA
- se anexa el archivo "API node.postman_collection.json" para poder importarlo en Postman y hacer las pruebas correspondientes.
// Middleware para manejar rutas no encontradas (404)
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

// Middleware para manejar errores generales (debe ser el último en la cadena)
export const generalErrorHandler = (err, req, res, next) => {
    // Imprime el error en la consola para depuración
    console.error(err.stack);

    // Envía una respuesta genérica de error 500
    res.status(500).json({
        error: 'Ocurrió un error inesperado en el servidor.',
    });
};
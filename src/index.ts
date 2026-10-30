import express from 'express';
import estudiantesRouter from './routes/estudiantes';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';

const app = express(); // Variable: aplicación de Express.
app.use(express.json()); // Middleware: permite leer el body JSON de las peticiones.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
const PORT = 3000; // Variable: puerto donde escuchará el servidor.

app.use('/api/estudiantes', estudiantesRouter); // Middleware

// #swagger.description = 'Comprueba que el servidor esté en línea'
app.get("/api/status", (_req, res) => { 
  res.json({
    status: "Servidor en línea",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

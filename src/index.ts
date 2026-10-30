import express from 'express';
import estudiantesRouter from './routes/estudiantes';
import cors from 'cors';

const app = express();
app.use(express.json()); // Middleware: permite leer el body JSON de las peticiones.
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use('/api/estudiantes', estudiantesRouter); // Middleware

app.get("/api/status", (_req, res) => {
  res.json({
    status: "Servidor en línea",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

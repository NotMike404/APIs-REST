import express from 'express';

const app = express(); // Variable app: Guarda la aplicación de Express.
app.use(express.json()); // Permite que Express lea el body de las peticiones POST y PUT en formato JSON.
const PORT = 3000; // Variable PORT: = Puerto donde correra el servidor.

interface Estudiante { // Tipo: Interface Describe los datos que tendrá cada estudiante.
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

const estudiantes: Estudiante[] = []; // Variable estudiantes: (tipo Estudiante): Guarda los estudiantes mientras el servidor está encendido.

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/api/status", (_req, res) => { // Ruta GET registra qué debe hacer el servidor cuando recibe una petición GET.
  res.json({
    status: "Servidor en línea",
    version: "1.0.0",
  });
});

app.get("/api/estudiantes", (_req, res) => { // Ruta GET (consulta): devuelve la lista de estudiantes.
  res.json(estudiantes); // Respuesta: envía el arreglo como JSON.
});
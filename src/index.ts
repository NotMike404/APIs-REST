import express from 'express';

const app = express(); // Variable: aplicación de Express.
app.use(express.json()); // Middleware: permite leer el body JSON de las peticiones.
const PORT = 3000; // Variable: puerto donde escuchará el servidor.

interface Estudiante { // Tipo: describe los datos que tiene cada estudiante.
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

const estudiantes: Estudiante[] = []; // Variable: arreglo que guarda estudiantes mientras el servidor está encendido.

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/api/status", (_req, res) => { // Método HTTP: ruta para consultar el estado del servidor.
  res.json({
    status: "Servidor en línea",
    version: "1.0.0",
  });
});

app.get("/api/estudiantes", (_req, res) => { // Método HTTP: ruta para consultar la lista de estudiantes.
  res.json(estudiantes);
});

app.post("/api/estudiantes", (req, res) => { // Método HTTP: ruta para crear estudiantes.
  if (!req.body || !req.body.email) {
    return res.status(400).json({ mensaje: "El email es obligatorio." }); // 400: falta el email requerido.
  }

  const datos = req.body as Omit<Estudiante, "id">; // Variable; Omit indica que los datos recibidos no incluyen el ID.

  const nuevoEstudiante: Estudiante = { // Variable: estudiante nuevo que vamos a guardar.
    id: Math.max(0, ...estudiantes.map((estudiante) => estudiante.id)) + 1, // Calcula el siguiente ID disponible.
    ...datos,
  };

  estudiantes.push(nuevoEstudiante); // Método de arreglo: agrega el estudiante al final.
  res.status(201).json(nuevoEstudiante); // Respuesta HTTP: 201 significa que se creó el estudiante.
});

app.put("/api/estudiantes/:id", (req, res) => { // Método HTTP: ruta para actualizar un estudiante.
  const id = Number(req.params.id); // Variable: convierte a número el ID de la dirección.
  const estudiante = estudiantes.find((estudiante) => estudiante.id === id); // find busca el estudiante que coincide con el ID.

  if (!estudiante) {
    return res.status(404).json({ mensaje: "Estudiante no encontrado." }); // 404 significa que no se encontró el estudiante.
  }

  const datos = req.body as Omit<Estudiante, "id">; // Variable: datos para actualizar, sin cambiar el ID.
  Object.assign(estudiante, datos); // Copia los datos nuevos en el estudiante encontrado.

  res.json(estudiante);
});

app.delete("/api/estudiantes/:id", (req, res) => { // Método HTTP: ruta para eliminar un estudiante.
  const id = Number(req.params.id); // Variable: convierte a número el ID de la dirección.
  const indice = estudiantes.findIndex((estudiante) => estudiante.id === id); // findIndex busca la posición del estudiante.

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Estudiante no encontrado." }); // 404 significa que no se encontró el estudiante.
  }

  estudiantes.splice(indice, 1); // Método de arreglo: elimina un elemento en la posición indicada.
  res.status(204).send(); // 204 significa que se eliminó correctamente y no hay contenido que enviar.
});
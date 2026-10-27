import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  paginas: number;
  disponible: boolean;
}

const libros: Libro[] = [
  { id: 1, titulo: "El principito", autor: "Antoine de Saint-Exupéry", paginas: 96, disponible: true },
  { id: 2, titulo: "La ciudad y los perros", autor: "Mario Vargas Llosa", paginas: 448, disponible: false },
  { id: 3, titulo: "Matilda", autor: "Roald Dahl", paginas: 240, disponible: true },
  { id: 4, titulo: "Miedo", autor: "Osho", paginas: 133, disponible: true },
  { id: 5, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", paginas: 863, disponible: true },
  { id: 6, titulo: "Orgullo y prejuicio", autor: "Jane Austen", paginas: 432, disponible: false },
]
//GET /api/libros - (Listar todos)
app.get("/api/libros", (_req, res) => {
  res.json(libros);
});
//GET /api/libros/:id - (Buscar por ID)
app.get("/api/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find((libro) => libro.id === id);

  if (!libro) {
    return res.status(404).json({ mensaje: "Libro no encontrado" });
  }
  res.json(libro);
});

// POST /api/libros - (Registrar libro)
app.post("/api/libros", (req, res) => {
  const datos = req.body as Omit<Libro, "id">; // Omit<Libro, "id"> significa: “los datos de un libro, excepto el ID”.

  const nuevoLibro: Libro = {
    id: Math.max(0, ...libros.map((libro) => libro.id)) + 1,
    ...datos,
  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro); // 201 indica que se creó el registro.
});
// Para probar la creación con Thunder Client:
// Método: POST
// URL: http://localhost:3000/api/libros
// Selecciona Body > JSON y envía este contenido (sin los //):
// {
//   "titulo": "Alicia en el país de las maravillas",
//   "autor": "Lewis Carroll",
//   "paginas": 200,
//   "disponible": true
// }

// PUT /api/libros/:id - (Actualizar datos)
app.put("/api/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find((libro) => libro.id === id);

  if (!libro) { // el signo "!" significa “no”, si libro no existe, responde con 404.
    return res.status(404).json({ mensaje: "Libro no encontrado" }); // 404 significa no encontrado.
  }

  const datos = req.body as Omit<Libro, "id">;
  Object.assign(libro, datos);

  res.json(libro);
});
// Para probar la actualización con Thunder Client:
// Método: PUT
// URL: http://localhost:3000/api/libros/2
// El 2 es el ID del libro que vamos a cambiar; reemplázalo por el ID del libro que quieras cambiar.
// Selecciona Body > JSON y envía todos los campos del libro (sin los //), sin incluir el id:
// {
//   "titulo": "Cien años de soledad",
//   "autor": "Gabriel García Márquez",
//   "paginas": 471,
//   "disponible": true
// }

// DELETE /api/libros/:id - (Eliminar libro)
app.delete("/api/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = libros.findIndex((libro) => libro.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Libro no encontrado" });
  }

  libros.splice(indice, 1); // splice es una función para modificar un arreglo, en este caso, eliminar el libro.
  res.json({ mensaje: "Libro eliminado correctamente" });
});
// Para probar la eliminación con Thunder Client:
// Método: DELETE
// URL: http://localhost:3000/api/libros/6
// El 6 es el ID del libro que vamos a eliminar; reemplázalo por el ID del libro que quieras eliminar.
// No es necesario enviar Body.
// Después puedes hacer un GET a http://localhost:3000/api/libros para verificar que ya no aparece.

app.get("/", (_req, res) => {
  res.send("¡Servidor Express funcionando!");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});

// NOTA: No apliqué el soft delete, ya que solamente simulamos una base de datos, al reiniciar el servidor vuelven los datos nuevamente.
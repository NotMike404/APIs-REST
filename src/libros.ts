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
// Selecciona Body > JSON y envía este contenido:
// {
//   "titulo": "Alicia en el país de las maravillas",
//   "autor": "Lewis Carroll",
//   "paginas": 200,
//   "disponible": true
// }

app.get("/", (_req, res) => {
  res.send("¡Servidor Express funcionando!");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});


// PUT /api/libros/:id - (Actualizar datos)


// DELETE /api/libros/:id - (Eliminar libro)


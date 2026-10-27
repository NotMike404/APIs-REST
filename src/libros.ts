import express from "express";

const app = express();
const port = 3000;

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

app.get("/api/libros", (_req, res) => {
  res.json(libros);
});

app.get("/api/libros/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find((libro) => libro.id === id);

  if (!libro) {
    return res.status(404).json({ mensaje: "Libro no encontrado" });
  }

  res.json(libro);
});

app.get("/", (_req, res) => {
  res.send("¡Servidor Express funcionando!");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});

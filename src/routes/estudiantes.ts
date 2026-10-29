// Refactorización:
import { Router } from "express";

const router = Router();

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

const estudiantes: Estudiante[] = [];

// Endpoint GET
router.get("/", (req, res) => { 
  const bootcamp = req.query.bootcamp;

  if (typeof bootcamp === "string") {
    return res.json(
      estudiantes.filter((estudiante) => estudiante.bootcamp === bootcamp)
    );
  }

  res.json(estudiantes);
});

// Endpoint GET/ID
router.get("/:id", (req, res) => { 
  const id = Number(req.params.id);
  const estudiante = estudiantes.find((estudiante) => estudiante.id === id);

  if (!estudiante) {
    return res.status(404).json({ mensaje: "Estudiante no encontrado." });
  }

  res.json(estudiante);
});

// Endpoint POST
router.post("/", (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ mensaje: "El email es obligatorio." });
  }

  const datos = req.body as Omit<Estudiante, "id">;
  const nuevoEstudiante: Estudiante = {
    id: Math.max(0, ...estudiantes.map((estudiante) => estudiante.id)) + 1,
    ...datos,
  };

  estudiantes.push(nuevoEstudiante);
  res.status(201).json(nuevoEstudiante);
});

// Endpoint PUT
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const estudiante = estudiantes.find((estudiante) => estudiante.id === id);

  if (!estudiante) {
    return res.status(404).json({ mensaje: "Estudiante no encontrado." });
  }

  const datos = req.body as Omit<Estudiante, "id">;
  Object.assign(estudiante, datos); // Actualiza los datos sin cambiar el ID.

  res.json(estudiante);
});

// Endpoint DELETE
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = estudiantes.findIndex((estudiante) => estudiante.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Estudiante no encontrado." });
  }

  estudiantes.splice(indice, 1);
  res.status(204).send();
});

export default router;
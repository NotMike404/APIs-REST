// Middlewares en Express con TypeScript

import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

app.use(express.json()); // Prepara express para recibir JSON.

// Definir la interfaz Producto
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

const productos: Producto[] = []; // simular una base de datos en memoria

// Crear el middleware validarProducto

const validarProducto = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ error: "El cuerpo debe ser un objeto JSON." });
    return;
  }

  const { nombre, precio, stock, activo } = req.body;

  if (typeof nombre !== "string" || nombre.trim() === "") {
    res.status(400).json({ error: "El nombre es obligatorio y debe ser texto." });
    return;
  }

  if (typeof precio !== "number" || precio <= 0) {
    res.status(400).json({ error: "El precio debe ser un número mayor a 0." });
    return;
  }

  if (typeof stock !== "number" || stock < 0) {
    res.status(400).json({ error: "El stock debe ser un número mayor o igual a 0." });
    return;
  }

  if (typeof activo !== "boolean") {
    res.status(400).json({ error: "El campo activo debe ser booleano." });
    return;
  }

  next();
};
//** Cada condición busca un dato inválido.
// Si lo encuentra, responde con 400 Bad Request y usa return para detener el middleware.
// Si todos los datos pasan las comprobaciones, llama a next() para continuar. */

// Validación de Datos (POST)
app.post("/api/productos", validarProducto, (req, res) => { // app.post(...), registra la ruta para crear productos.
  const datos = req.body as Omit<Producto, "id">; 

  const nuevoProducto: Producto = {
    id: Math.max(0, ...productos.map((producto) => producto.id)) + 1,
    nombre: datos.nombre.trim(), // .trim() quita los espacios en el texto. Por ejemplo: "  Teclado  ".trim() = "Teclado".
    precio: datos.precio,
    stock: datos.stock,
    activo: datos.activo,
  };

  productos.push(nuevoProducto); // productos.push(...) lo guarda en el arreglo
  res.status(201).json(nuevoProducto); // 201 indica que se creó.
});

// Actualiza los datos de un producto usando su ID.
app.put("/api/productos/:id", validarProducto, (req, res) => {
  const id = Number(req.params.id); // Toma el ID de la URL.
  const indice = productos.findIndex((producto) => producto.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  const datos = req.body as Omit<Producto, "id">;

  const productoActualizado: Producto = {
    id,
    nombre: datos.nombre.trim(),
    precio: datos.precio,
    stock: datos.stock,
    activo: datos.activo,
  };

  productos[indice] = productoActualizado;
  res.json(productoActualizado);
});

// Validación de Datos (GET)
app.get("/api/productos", (_req, res) => { // app.get registra una ruta de consulta; sin esto, el producto se crea pero no se puede ver.
  res.json(productos.filter((producto) => producto.activo)); 
});



app.listen(PORT, () => { // app.listen(...) inicia el servidor.
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


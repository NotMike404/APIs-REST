// Middlewares en Express con TypeScript

import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

app.use(express.json()); // Prepara express para recibir JSON.

// Definir la interfaz Producto:
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

const productos: Producto[] = [ // simular una base de datos en memoria
{
    id: 1,
    nombre: "Teclado",
    precio: 25,
    stock: 10,
    activo: true,
  },
  {
    id: 2,
    nombre: "Mouse",
    precio: 15,
    stock: 8,
    activo: true,
  },
  {
    id: 3,
    nombre: "Monitor",
    precio: 180,
    stock: 5,
    activo: true,
  },
  {
    id: 4,
    nombre: "Audífonos",
    precio: 45,
    stock: 12,
    activo: true,
  },
];

// Crear el middleware validarProducto:
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

// Implementar verificarRol:
// Roles permitidos para controlar quién puede ejecutar ciertas rutas.
type Rol = "MODERADOR" | "ADMIN";

// Crea un middleware que exige el rol indicado para dejar pasar la solicitud.
const verificarRol = (rolMinimo: Rol) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Lee el rol enviado por el cliente en el encabezado HTTP "x-role".
    const rol = req.header("x-role");

    // ADMIN solo permite ADMIN; MODERADOR permite MODERADOR o ADMIN.
    const tienePermiso =
      rolMinimo === "ADMIN"
        ? rol === "ADMIN"
        : rol === "MODERADOR" || rol === "ADMIN"; // en thunder client > Headers > header = x-role y value ADMIN y otro para MODERADOR.

    // Si no cumple el nivel requerido, responde 403 y detiene la solicitud.
    if (!tienePermiso) {
      res.status(403).json({
        error: `Acceso denegado. Se requiere rol ${rolMinimo}.`,
      });
      return;
    }

    // Si tiene permiso, continúa hacia la ruta.
    next();
  };
};

// Validación de Datos (POST):
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

// Validación de Datos (GET):
app.get("/api/productos", (_req, res) => { // app.get registra una ruta de consulta; sin esto, el producto se crea pero no se puede ver.
  res.json(productos.filter((producto) => producto.activo)); 
});

// Asignar el borrado lógico (Soft Delete):
// Desactiva un producto; solo MODERADOR o ADMIN pueden hacerlo.
app.patch("/api/productos/soft/:id", verificarRol("MODERADOR"), (req, res) => { // Si es soft Delete, se cambia la ruta especificando /soft.
  const id = Number(req.params.id);
  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  producto.activo = false;
  res.json({ mensaje: "Producto desactivado.", producto });
});

// Asignar el borrado definitivo (Hard Delete):
// Elimina definitivamente un producto; solo ADMIN puede hacerlo.
app.delete("/api/productos/hard/:id", verificarRol("ADMIN"), (req, res) => { // Si es hard Delete, se cambia la ruta especificando /soft.
  const id = Number(req.params.id);
  const indice = productos.findIndex((producto) => producto.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  productos.splice(indice, 1);
  res.json({ mensaje: "Producto eliminado definitivamente." });
});

app.listen(PORT, () => { // app.listen(...) inicia el servidor.
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


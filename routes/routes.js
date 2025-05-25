import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import path from "path";
import {Router} from "express";

dotenv.config();
const PORT = process.env.PORT || 3000;
const filePath = new URL('../users.json', import.meta.url);
export const router = Router();

router.get('/', (req, res) => {
    console.log(filePath)
    res.send(`
    <h1>Curso de Express.js</h1>
    <p>Este es un ejemplo de una aplicación Express.js.</p>
    <p>Corre en el puerto ${PORT}.</p>
    `);
});

router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`
    <h1>User ID: ${userId}</h1>
    <p>Este es el perfil del usuario con ID ${userId}.</p>
    `);
})

router.get('/search', (req, res) => {
    const termino = req.query.termino;
    const categoria = req.query.categoria;
    res.send(`
    <h1>Resultados de la búsqueda</h1>
    <p>Termino: ${termino}</p>
    <p>Categoria: ${categoria}</p>
    `);
})

router.get('/users', async (req, res) => {
    try {
        const data = await readFile(filePath.pathname, 'utf-8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        res.status(500).json({ error: 'Error al leer el archivo de usuarios.' });
    }
})

router.post('/form', (req, res) => {
    const nombre = req.body.nombre;
    const email = req.body.email;
    res.json({
        nombre,
        email
    })
})

router.post('/api/data', (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({error: 'No hay datos en el cuerpo de la petición.'})
    }
    res.status(201).json({
        message: 'Datos recibidos correctamente.',
        data
    });
})

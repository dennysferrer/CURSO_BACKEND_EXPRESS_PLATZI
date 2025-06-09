import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "path";
import {Router} from "express";
import { read, write } from "node:fs";
import { validateUser } from '../middlewares/validations.js';



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

router.post('/users', validateUser, async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Faltan datos del usuario.' });
    }
    try {
        const data = await readFile(filePath.pathname, 'utf-8');
        const users = JSON.parse(data);
        const newUser = {
            "id": users.length + 1, // Asignar un ID único 
            name, 
            email 
        };
        users.push(newUser);
        await writeFile(filePath.pathname, JSON.stringify(users, null, 2));
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ error: 'Error al guardar el usuario.' });
    }
    
})


router.put('/users/:id', validateUser, async (req, res) => {
    const userId = parseInt(req.params.id);
    const updateUser = req.body;
    if (!updateUser.name || !updateUser.email) {
        return res.status(400).json({ error: 'Faltan datos del usuario.' });
    }
    try {
        const usersData = await readFile(filePath.pathname, 'utf-8');
        const users = JSON.parse(usersData);
        const userToUpdate = users.find(user => user.id === userId);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        // Actualizar los datos del usuario
        userToUpdate.name = updateUser.name;
        userToUpdate.email = updateUser.email;
        // Guardar los cambios en el archivo
        await writeFile(filePath.pathname, JSON.stringify(users, null, 2));
        res.json(userToUpdate);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
        
    }
})

router.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const usersData = await readFile(filePath.pathname, 'utf-8');
        let users = JSON.parse(usersData);
        const usertoDelete = users.find(user => user.id === userId);
        if (!usertoDelete) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        // Filtrar el usuario a eliminar
        users = users.filter(user => user.id !== userId);
        // Guardar los cambios en el archivo
        await writeFile(filePath.pathname, JSON.stringify(users, null, 2));
        res.json({ 
            message: 'Usuario eliminado correctamente.', 
            user: usertoDelete
        });

    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario.' });
        
    }
})
import express from "express";
import mysql from "mysql"

const app = express();
app.use(express.json());
const puerto = 3000;

const database_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phpmyadmin'
    }
const database = mysql.createConnection(database_config);

database.connect((error) => {
    if (error) {
    console.error('Error de conexión a la base de datos:', error);
    } else {
    console.log('Conexión exitosa a la base de datos');
    }
    });

 const CrearTabla = `
        CREATE TABLE IF NOT EXISTS videojuegos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        genero VARCHAR(255) NOT NULL,
        plataforma VARCHAR(255) NOT NULL
        )
        `;
        
database.query(CrearTabla, (error) => {
        if (error) {
        console.error('Error al crear la tabla de videojuegos:', error);
        } else {
        console.log('Tabla de videojuegos creada correctamente');
        }
        });
//empiezo a manipular la base de datos
        app.post('/videojuegos', (req, res) => {
            const { nombre, genero, plataforma } = req.body;
            const query = 'INSERT INTO videojuegos (nombre, genero, plataforma) VALUES (?, ?, ?)';
            
            database.query(query, [nombre, genero, plataforma], (err, result) => {
            if (err) {
            console.error('Error al crear un nuevo videojuego:', err);
            res.status(500).json({ error: 'Error al crear un nuevo videojuego' });
            } else {
            res.json({ id: result.insertId, nombre, genero, plataforma });
            }
            });
            });

            app.get('/videojuegos', (req, res) => {
                database.query('SELECT * FROM videojuegos', (err, results) => {
                if (err) {
                console.error('Error al obtener videojuegos:', err);
                res.status(500).json({ error: 'Error al obtener videojuegos' });
                } else {
                res.json(results);
                }
                });
                });

            app.delete('/videojuegos/:id', (req, res) => {
                    const { id } = req.params;
                    const query = 'DELETE FROM videojuegos WHERE id = ?';
                    
                    database.query(query, [id], (err, result) => {
                    if (err) {
                    console.error('Error al eliminar el videojuego:', err);
                    res.status(500).json({ error: 'Error al eliminar el videojuego' });
                    } else {
                    if (result.affectedRows > 0) {
                    res.json({ message: 'Videojuego eliminado correctamente' });
                    } else {
                    res.status(404).json({ error: 'Videojuego no encontrado' });
                    }
                    }
                    });
                    });

app.listen(puerto, () => {
                    console.log(`Servidor escuchando en http://localhost:${puerto}`);
                    });

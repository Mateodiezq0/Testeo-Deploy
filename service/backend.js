import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ArtistasConsulta, EsculturasConsulta, EventosConsulta, login, obtenerArtistaYObraReciente } from './conexiondb.js';
import { ordenarEsculturas, buscarEsculturas, ordenarEventos, buscarEventos, ordenarArtistas, buscarArtistas } from './filtrosObjetos.js';
import jwt from 'jsonwebtoken';

// Clave secreta para firmar el token (debería ser almacenada de forma segura, como en variables de entorno)
const JWT_SECRET = 'mi_clave_secreta'; // Cambir por algo más seguro

let esculturas = [];
let eventos = [];
let artistas = [];
let usuario = '';

const express = require('express');
const path = require('path');
const app = express();

const express = require('express');

// Ruta para obtener los escultores
app.get('/api/escultores', (req, res) => {
  // Lógica para obtener escultores
  res.json([{ escultorName: "Artista 1", escultorFoto: "url", contactoEmail: "email@dominio.com" }]);
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});



// Servir archivos estáticos generados por el frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// Cualquier otra ruta debería devolver el index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});





const apiUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://testeo-deploy-nuevo.vercel.app' : 'http://localhost:3001');

app.use(cors()); // Permitir CORS
// Middleware para analizar el cuerpo de la solicitud (JSON)
app.use(bodyParser.json());



// Crear una función asincrónica para manejar las consultas a la base de datos
const obtenerArtistas = async (busqueda, criterio, orden) => {
  try {
    if (artistas.length == 0) {
      artistas = await ArtistasConsulta();
    }
    // Asegúrate de que esculturas es un array
    if (!Array.isArray(artistas)) {
      throw new Error('La consulta no devolvió un array');
    }

    const artistasFiltrados = buscarArtistas(artistas, busqueda);
    const ArtistasOrdenados = ordenarArtistas(artistasFiltrados, criterio, orden);

    const cards = [];
    for (const [index, artista] of ArtistasOrdenados.entries()) {
      // Accede a los métodos de la clase Esculturas
      const nombre = artista.getNyA();
      const imagen = artista.getURL_foto();
      const biografia = artista.getRes_biografia();
      const contacto = artista.getContacto();

      cards.push({
        id: index + 1,
        escultorPantalla: nombre.replace(/ /g, ''), 
        content: biografia,
        escultorName: nombre,
        escultorFoto: imagen,
        contactoEmail: contacto
      });
    }

    return cards;

  } catch (error) {
    console.error('Error al obtener artistas:', error);
    return [];
  }
};

const obtenerEsculturas = async (busqueda, criterio, orden) => {
  try {
    if (esculturas.length == 0) {
      esculturas = await EsculturasConsulta();
    }
    // Asegúrate de que esculturas es un array
    if (!Array.isArray(esculturas)) {
      throw new Error('La consulta no devolvió un array');
    }

    const esculturasFiltradas = buscarEsculturas(esculturas, busqueda);
    const esculturasOrdenadas = ordenarEsculturas(esculturasFiltradas, criterio, orden);

    const cards = [];
    for (const [index, escultura] of esculturasOrdenadas.entries()) {
      // Accede a los métodos de la clase Esculturas
      const listaObraImagenes = escultura.getImagenes();
      const obraImagen = listaObraImagenes[0].getURL();
      const tecnica = escultura.getTecnica();
      const obraNombre = escultura.getNombre();
      const obraArtistas = escultura.getArtistas();
      const obraArtista = obraArtistas[0].getNyA();
      const obraEscultorFoto = obraArtistas[0].getURL_foto();
      const average = escultura.getPromedio();
      const fecha_creacion = escultura.getFechaCreacion();
      const promedioEstrellas = escultura.getPromedio();
      const antecedente = escultura.getAntecedente();

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedFecha_creacion = fecha_creacion.toLocaleDateString('es-ES', options);

      cards.push({
        id: index + 1,
        title: 'Carta' + (index + 1),
        obraPantalla: obraNombre.replace(/ /g, ''),
        obraImage: obraImagen,
        content: tecnica,
        obraName: obraNombre,
        obraEscultor: obraArtista,
        obraEscultorFoto: obraEscultorFoto,
        promedio: average,
        f_creacion: formattedFecha_creacion,
        promedio: promedioEstrellas,
        antecedente: antecedente
      });
    }

    return cards;

  } catch (error) {
    console.error('Error al obtener esculturas:', error);
    return [];  // Retornar un array vacío en caso de error
  }
};

const obtenerEventos = async (busqueda, criterio, orden) => {
  try {
    if (esculturas.length == 0) {
      eventos = await EventosConsulta();
    }
    // Asegúrate de que esculturas es un array
    if (!Array.isArray(eventos)) {
      throw new Error('La consulta no devolvió un array');
    }

    const eventosFiltrados = buscarEventos(eventos, busqueda);
    const eventosOrdenados = ordenarEventos(eventosFiltrados, criterio, orden);

    const cards = [];
    for (const [index, evento] of eventosOrdenados.entries()) {
      // Accede a los métodos de la clase Eventos
      const titulo = evento.getNombre();
      const fechaInicio = new Date(evento.getFechaInicio());
      const fechaFin = new Date(evento.getFechaFin());
      const tematica = evento.getTematica();
      const lugar = evento.getLugar();
      const horaInicio = evento.getHoraInicio();
      const horaFin = evento.getHoraFin();
      const options = {month: 'long', day: 'numeric' };
      const formattedFechaInicio = fechaInicio.toLocaleDateString('es-ES', options);
      const formattedFechaFin = fechaFin.toLocaleDateString('es-ES', options);

      const formattedHoraInicio = horaInicio.split(':').slice(0, 2).join(':');  // De "09:30:00" a "09:30"
      const formattedHoraFin = horaFin.split(':').slice(0, 2).join(':');        // De "15:00:00" a "15:00"


      cards.push({
        title: 'evento' + (index + 1),
        eventName: titulo,
        eventoPantalla: titulo.replace(/ /g, ''),
        eventStartDate: formattedFechaInicio,
        eventFinishDate: formattedFechaFin,
        startTime: formattedHoraInicio,
        finishTime: formattedHoraFin,
        location: lugar,
        content: tematica
      });
    }

    return cards;

  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];  // Retornar un array vacío en caso de error
  }
};

app.get('/api/escultores/:nombre', async (req, res) => {
  const nombre = req.params.nombre; // Obtiene el nombre del parámetro de la URL
  const cards = await obtenerArtistas(nombre, 'nombre', 'DESC');; // Función para obtener un escultor específico
  res.json(cards[0]);
});

// Endpoint para obtener escultores
app.get('/api/escultores', async (req, res) => {
  const searchQuery = req.query.search;
  const criterio = req.query.sortBy;
  const orden = req.query.order;
  console.log(usuario);
  const cards = await obtenerArtistas(searchQuery, criterio, orden);  // Esperamos a que se procesen todas las consultas
  res.json(cards);
});

// Endpoint para obtener esculturas
app.get('/api/esculturas', async (req, res) => {
  const searchQuery = req.query.search;
  const criterio = req.query.sortBy;
  const orden = req.query.order;
  const cards = await obtenerEsculturas(searchQuery, criterio, orden);  // Esperamos a que se procesen todas las consultas
  res.json(cards);
});

app.get('/api/obras/:nombre', async (req, res) => {
  const nombre = req.params.nombre; // Obtiene el nombre del parámetro de la URL
  const cards = await obtenerEsculturas(nombre, 'nombre', 'DESC');
  res.json(cards[0]);
});

app.get('/api/eventos', async (req, res) => {
  const searchQuery = req.query.search;
  const criterio = req.query.sortBy;
  const orden = req.query.order;
  const cards = await obtenerEventos(searchQuery, criterio, orden);  // Esperamos a que se procesen todas las consultas
  res.json(cards);
});

app.get('/api/eventos/:nombre', async (req, res) => {
  const nombre = req.params.nombre; // Obtiene el nombre del parámetro de la URL
  const cards = await obtenerEventos(nombre, 'nombre', 'DESC');
  res.json(cards[0]);
});

app.post('/api/login', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar si se ingresaron correo y contraseña
  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Por favor ingrese correo y contraseña' });
  }

  login(correo, contraseña)
    .then(conexion => {
      // Aquí es donde manejamos los resultados
      if (conexion && conexion.length > 0) {
        // Crear el token con correo y permisos de la respuesta de la base de datos
        const token = jwt.sign({ correo: conexion[0].email, permisos: conexion[0].permisos }, JWT_SECRET, { expiresIn: '1h' });

        // Responder con el token
        return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', token });
      } else {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
    })
    .catch(error => {
      // En caso de error, enviamos una respuesta con estado 500
      console.error('Error en la conexión:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    });
});


// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Obtener el token después de 'Bearer '

  if (!token) return res.status(403).json({ success: false, message: 'Token no proporcionado' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => { // Usar JWT_SECRET aquí
      if (err) return res.status(403).json({ success: false, message: 'Token inválido' });
      req.user = decoded; // Guardar la información del usuario decodificada
      next();
  });
};

// Endpoint para verificar el token y obtener el correo
app.get('/api/verificar', verificarToken, (req, res) => {
    const correo = req.user.correo; // Suponiendo que el correo está en el payload del token
    res.json({ success: true, correo });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.get('/api/artista/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const artistaObra = await obtenerArtistaYObraReciente(email);

    if (!artistaObra) {
      return res.status(404).json({ success: false, message: 'Artista no encontrado o sin obras recientes' });
    }

    res.json({
      success: true,
      artista: {
        nombre: artistaObra.artistaNombre,
        dni: artistaObra.artistaDNI,
        biografia: artistaObra.biografia,
        contacto: email, // Puede que quieras incluir el contacto o eliminar este campo
      },
      obraReciente: {
        nombre: artistaObra.obraNombre,
        fechaCreacion: artistaObra.obraFechaCreacion,
        tecnica: artistaObra.tecnica,
        imagenURL: artistaObra.imagen_url
      }
    });
  } catch (error) {
    console.error("Error en el endpoint de artista:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});
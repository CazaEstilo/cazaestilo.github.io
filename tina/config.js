// tina/config.js

import { defineConfig } from 'tinacms';

export default defineConfig({
  // *** 1. AUTENTICACIÓN DE GITHUB (DEBES EDITAR ESTO) ***
  
  // Esto se obtiene al crear la aplicación OAuth en GitHub
  clientId: 'Ov23li52LeFt3hEh6BuD', 
  token: 'ef8d4a122a576728a5d61081da44f655dd5432dd', 
  
  // La rama donde Tina hará las ediciones (debe ser 'main')
  branch: 'main', 

  // *** 2. CONFIGURACIÓN DEL SITIO Y RUTAS ***
  
  // Tina usa 'public' como la carpeta raíz para los assets
  build: {
    publicFolder: 'public', 
    outputFolder: 'tina-output',
  },

  // Configuración de la carpeta de medios
  media: {
    tina: {
      // Ruta dentro del repositorio donde se guardan las imágenes subidas
      mediaRoot: 'assets/img/products', 
      // Ruta pública para acceder a esas imágenes (Asegúrate de que 'public' sea la raíz)
      publicFolder: 'public/CazaEstilo', 
    },
  },

  // *** 3. DEFINICIÓN DE COLECCIONES (Tus productos) ***
  schema: {
    collections: [
      {
        name: 'productos',
        label: 'Productos Destacados',
        path: '_productos', // Carpeta donde se encuentran tus archivos .json
        format: 'json',
        fields: [
          { name: 'title', label: 'Nombre del Producto', type: 'string' },
          { name: 'body', label: 'Descripción Detallada', type: 'rich-text' },
          { name: 'price', label: 'Precio (COP)', type: 'number' },
          { name: 'stock', label: 'Stock Disponible', type: 'number' },
          { name: 'quality', label: 'Calidad (%)', type: 'number' },
          {
            name: 'images',
            label: 'Imágenes del Carrusel (Max 3)',
            type: 'object',
            list: true,
            max: 3,
            ui: {
              component: 'list',
            },
            fields: [
              { name: 'image', label: 'Imagen', type: 'image' },
            ],
          },
        ],
      },
    ],
  },
});
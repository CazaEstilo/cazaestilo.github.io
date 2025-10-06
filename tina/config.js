// tina/config.js

import { defineConfig } from 'tinacms';

export default defineConfig({
  // CONFIGURACIÓN DE IDENTIFICACIÓN DE GITHUB
  branch: 'main', // La rama donde está tu código
  
  clientId: 'reemplaza_con_client_id_github', // (Necesitarás un GitHub OAuth App, ver paso 3)
  token: 'reemplaza_con_el_token_de_tu_app', // (Necesitarás un GitHub OAuth App, ver paso 3)

  build: {
    publicFolder: 'public', // Carpeta donde Tina buscará los archivos públicos (assets/img, etc)
    outputFolder: 'tina-output', // Carpeta de salida del CMS (no es crítica ahora)
  },

  media: {
    tina: {
      mediaRoot: 'assets/img/products',
      publicFolder: 'public/CazaEstilo', // Rutas públicas para las imágenes
    },
  },

  // DEFINICIÓN DE COLECCIONES (Tus productos)
  schema: {
    collections: [
      {
        name: 'productos',
        label: 'Productos Destacados',
        path: '_productos', // Carpeta donde se guardan tus archivos de contenido
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
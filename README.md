# OptimizedOP - Optimizador de Imágenes para Proyectos Web

Este optimizador de imágenes convierte automáticamente imágenes de diversos formatos (incluyendo SVG) a formato WebP para mejorar el rendimiento de sitios web.

![Estado](https://img.shields.io/badge/Estado-Activo-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)

## 📋 Características

- ✅ Conversión automática a formato WebP optimizado para web
- ✅ Soporte para múltiples formatos de entrada (JPG, PNG, GIF, BMP, TIFF y SVG)
- ✅ Configuración de calidad de compresión ajustable
- ✅ Opción para redimensionar imágenes durante la optimización
- ✅ Procesamiento especial para SVG con control de densidad (DPI)
- ✅ Preservación de transparencia en imágenes PNG y SVG
- ✅ Interfaz de línea de comandos fácil de usar

## 🚀 Instalación

### Requisitos previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Instalación del proyecto

```bash
# Clonar el repositorio o descargar los archivos
git clone <url-del-repositorio>
cd optimizedOP

# Instalar dependencias
npm install
```

### Instalación global (opcional)

Si deseas usar la herramienta desde cualquier ubicación:

```bash
npm link
```

## 🛠️ Uso

### Estructura básica

Por defecto, la herramienta busca imágenes en la carpeta `images` y guarda las versiones optimizadas en la carpeta `optimized`.

```
proyecto/
├── images/         # Carpeta de imágenes originales
└── optimized/      # Carpeta donde se guardan las imágenes optimizadas
```

### Uso básico

```bash
# Utilizando npm
npm run optimize

# Utilizando node directamente
node cli.js

# Si está instalado globalmente
optimizedop
```

### Opciones disponibles

La herramienta acepta varios parámetros para personalizar el proceso:

```bash
optimizedop [directorio-entrada] [directorio-salida] [opciones]
```

| Opción | Descripción |
|--------|-------------|
| `--quality`, `-q` | Calidad de las imágenes WebP (1-100, default: 80) |
| `--width`, `-w` | Ancho máximo en píxeles |
| `--height`, `-h` | Alto máximo en píxeles |
| `--help` | Muestra la ayuda |

### Ejemplos

```bash
# Procesar imágenes con calidad 90
node cli.js --quality 90

# Procesar imágenes en carpetas personalizadas
node cli.js carpeta-fuente carpeta-destino

# Redimensionar imágenes a un ancho máximo de 800px
node cli.js --width 800

# Procesar imágenes de una carpeta específica con calidad personalizada
node cli.js assets/img web/img --quality 85
```

## 🔍 Características especiales

### Procesamiento de SVG

Los archivos SVG se procesan con configuraciones especiales:

- Rasterización con alta densidad de píxeles (300 DPI por defecto)
- Preservación de transparencia
- Calidad alfa optimizada

Si desea ajustar estos parámetros, puede modificar la configuración `svgOptions` en `index.js`.

### Uso como módulo

También puede utilizar OptimizedOP como módulo en sus propios scripts:

```javascript
const optimizer = require('./index.js');

// Configurar opciones
optimizer.updateConfig({
  inputDir: 'mis-imagenes',
  outputDir: 'imagenes-optimizadas',
  quality: 85
});

// Procesar imágenes
async function optimizar() {
  await optimizer.ensureDirectories();
  const resultados = await optimizer.processAllImages();
  console.log(`Imágenes procesadas: ${resultados.length}`);
}

optimizar();
```

## 📊 Consideraciones sobre rendimiento

### Ventajas del formato WebP

- Tamaños de archivo hasta un 30% más pequeños que JPEG con calidad similar
- Soporte para transparencia con menor tamaño que PNG
- Compatible con la mayoría de navegadores modernos

### Recomendaciones de calidad

- **Fotografías**: Calidad 75-85
- **Ilustraciones y gráficos**: Calidad 85-90
- **Capturas de pantalla**: Calidad 80-90
- **Logos e iconos**: Calidad 90-95 (o usar SVG original cuando sea posible)

## 🧩 Dependencias

- [sharp](https://www.npmjs.com/package/sharp): Procesamiento rápido de imágenes
- [fs-extra](https://www.npmjs.com/package/fs-extra): Operaciones de sistema de archivos
- [glob](https://www.npmjs.com/package/glob): Búsqueda de archivos
- [path](https://www.npmjs.com/package/path): Manipulación de rutas de archivos

## 📝 Notas adicionales

### Conversión de SVG a WebP

Al convertir archivos SVG a WebP, tenga en cuenta:

- Se pierde la capacidad vectorial (escalable infinitamente)
- El tamaño del archivo WebP podría ser mayor que el SVG original
- La densidad de píxeles afecta directamente a la calidad final

### Compatibilidad con navegadores

El formato WebP es compatible con:
- Google Chrome (desde versión 32)
- Firefox (desde versión 65)
- Edge (desde versión 18)
- Safari (desde versión 14)
- Opera (desde versión 19)

Para navegadores más antiguos, considere implementar soluciones alternativas en su HTML:

```html
<picture>
  <source srcset="optimized/imagen.webp" type="image/webp">
  <img src="images/imagen.jpg" alt="Descripción">
</picture>
```

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia ISC.

---

Desarrollado con ❤️ para optimizar el rendimiento web.
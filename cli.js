#!/usr/bin/env node

const optimizer = require('./index');
const path = require('path');

// Mostrar ayuda
function showHelp() {
  console.log(`
🖼️  OptimizedOP - Optimizador de imágenes para proyectos web 🖼️

Uso:
  optimizedop [directorio-entrada] [directorio-salida] [opciones]

Opciones:
  --help, -h       Muestra esta ayuda
  --quality, -q    Calidad de WebP (1-100, default: 80)
  --width, -w      Ancho máximo (en píxeles)
  --height, -h     Alto máximo (en píxeles)

Ejemplos:
  optimizedop                          # Procesa 'images/' a 'optimized/'
  optimizedop src/img dist/img         # Carpetas personalizadas
  optimizedop assets/img web/img -q 90 # Con calidad específica
  optimizedop img output -w 800        # Redimensiona al ancho máximo
`);
}

// Procesar argumentos
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    inputDir: 'images',
    outputDir: 'optimized',
    quality: 80,
    resize: null
  };

  // Recorrer argumentos
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (arg === '--quality' || arg === '-q') {
      options.quality = parseInt(args[++i], 10) || 80;
    } else if (arg === '--width' || arg === '-w') {
      options.resize = options.resize || {};
      options.resize.width = parseInt(args[++i], 10);
    } else if (arg === '--height' || arg === '-h') {
      options.resize = options.resize || {};
      options.resize.height = parseInt(args[++i], 10);
    } else if (!arg.startsWith('-') && !options.inputDir || options.inputDir === 'images') {
      options.inputDir = arg;
    } else if (!arg.startsWith('-') && !options.outputDir || options.outputDir === 'optimized') {
      options.outputDir = arg;
    }
  }

  return options;
}

// Función principal
async function main() {
  try {
    // Obtener y configurar opciones
    const options = parseArgs();
    
    // Convertir rutas relativas a absolutas
    options.inputDir = path.resolve(process.cwd(), options.inputDir);
    options.outputDir = path.resolve(process.cwd(), options.outputDir);
    
    console.log(`
📋 Configuración:
  📁 Directorio de entrada: ${options.inputDir}
  📁 Directorio de salida: ${options.outputDir}
  🔍 Calidad WebP: ${options.quality}%
  🖼️ Redimensionar: ${options.resize ? 
    `${options.resize.width || 'auto'}x${options.resize.height || 'auto'}` : 'No'}
`);
    
    // Actualizar configuración y ejecutar
    optimizer.updateConfig(options);
    await optimizer.ensureDirectories();
    await optimizer.processAllImages();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main();
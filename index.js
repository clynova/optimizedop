const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// Configuración
const config = {
  inputDir: 'images', // Directorio de entrada por defecto
  outputDir: 'optimized', // Directorio de salida por defecto
  quality: 80, // Calidad de las imágenes WebP (0-100)
  resize: null, // Sin redimensionamiento por defecto
  formats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg'], // Formatos de entrada soportados
  svgOptions: {
    density: 300 // DPI para rasterizar SVG (mayor = mejor calidad pero archivo más grande)
  }
};

// Asegurarse de que los directorios existan
async function ensureDirectories() {
  await fs.ensureDir(config.inputDir);
  await fs.ensureDir(config.outputDir);
  console.log(`✅ Directorios verificados: ${config.inputDir} y ${config.outputDir}`);
}

// Procesar una sola imagen
async function processImage(filePath) {
  try {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    // Verificar si el formato está soportado
    if (!config.formats.includes(ext)) {
      console.log(`⚠️ Formato no soportado: ${filename}`);
      return;
    }
    
    // Nombre del archivo de salida (mismo nombre pero con extensión .webp)
    const outputFilename = path.basename(filename, ext) + '.webp';
    const outputPath = path.join(config.outputDir, outputFilename);
    
    console.log(`🔄 Procesando: ${filename}`);
    
    // Iniciar procesamiento con Sharp
    let imageProcess;
    
    // Manejo especial para SVG
    if (ext === '.svg') {
      console.log(`🔄 Procesando SVG con densidad ${config.svgOptions.density} DPI`);
      imageProcess = sharp(filePath, { 
        density: config.svgOptions.density, // Aumentar la densidad para mejor calidad
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente para SVG
      });
    } else {
      imageProcess = sharp(filePath);
    }
    
    // Aplicar redimensionamiento si está configurado
    if (config.resize) {
      imageProcess = imageProcess.resize(config.resize.width, config.resize.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convertir a WebP y guardar
    await imageProcess
      .webp({
        quality: config.quality,
        lossless: false,
        // Asegurar transparencia para SVG
        alphaQuality: ext === '.svg' ? 100 : 90
      })
      .toFile(outputPath);
    
    console.log(`✅ Optimizado: ${outputFilename}`);
    
    return {
      inputPath: filePath,
      outputPath,
      success: true
    };
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}:`, error.message);
    return {
      inputPath: filePath,
      error: error.message,
      success: false
    };
  }
}

// Procesar todas las imágenes en el directorio
async function processAllImages() {
  try {
    // Buscar todas las imágenes en el directorio de entrada
    const imageFiles = glob.sync(`${config.inputDir}/**/*.*`);
    
    if (imageFiles.length === 0) {
      console.log(`⚠️ No se encontraron imágenes en ${config.inputDir}`);
      return [];
    }
    
    console.log(`🔎 Encontradas ${imageFiles.length} imágenes para procesar`);
    
    // Procesar cada imagen
    const results = [];
    for (const file of imageFiles) {
      const result = await processImage(file);
      if (result) results.push(result);
    }
    
    // Resumen
    const successful = results.filter(r => r.success).length;
    console.log(`
🎉 Proceso completado:
  ✅ ${successful} imágenes optimizadas correctamente
  ❌ ${results.length - successful} imágenes fallidas
  📁 Las imágenes optimizadas están en: ${config.outputDir}
`);
    
    return results;
  } catch (error) {
    console.error('❌ Error al procesar las imágenes:', error.message);
    throw error;
  }
}

// Función para actualizar la configuración
function updateConfig(newConfig = {}) {
  Object.assign(config, newConfig);
  return config;
}

// Ejecutar el programa si se llama directamente
if (require.main === module) {
  // Obtener argumentos de la línea de comandos
  const args = process.argv.slice(2);
  
  // Procesar argumentos básicos (muy simple)
  if (args.length >= 1) config.inputDir = args[0];
  if (args.length >= 2) config.outputDir = args[1];
  
  // Ejecutar
  ensureDirectories()
    .then(processAllImages)
    .catch(err => {
      console.error('❌ Error en el proceso:', err.message);
      process.exit(1);
    });
} else {
  // Si se importa como módulo, exponer funciones
  module.exports = {
    processImage,
    processAllImages,
    updateConfig,
    ensureDirectories,
    config
  };
}
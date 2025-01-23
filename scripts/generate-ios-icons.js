import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../public/icons');

// Assurez-vous que le dossier icons existe
try {
  await fs.access(ICONS_DIR);
} catch {
  await fs.mkdir(ICONS_DIR, { recursive: true });
}

const SOURCE_LOGO = path.join(__dirname, '../src/assets/logo.png');

// Tailles d'icônes pour iOS
const ICON_SIZES = [
  { size: 152, name: 'apple-icon-152.png' },
  { size: 167, name: 'apple-icon-167.png' },
  { size: 180, name: 'apple-icon-180.png' },
  { size: 192, name: 'favicon.png' },
];

// Splash screen sizes
const SPLASH_SIZES = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' },
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' },
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' },
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png' },
  { width: 828, height: 1792, name: 'apple-splash-828-1792.png' },
  { width: 750, height: 1334, name: 'apple-splash-750-1334.png' },
  { width: 640, height: 1136, name: 'apple-splash-640-1136.png' },
];

// Générer les icônes
async function generateIcons() {
  try {
    // Générer les icônes carrées
    for (const icon of ICON_SIZES) {
      await sharp(SOURCE_LOGO)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(ICONS_DIR, icon.name));
      console.log(`✓ Généré ${icon.name}`);
    }

    // Générer les splash screens
    for (const splash of SPLASH_SIZES) {
      // Créer un fond blanc
      const background = await sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      }).png().toBuffer();

      // Calculer la taille du logo (40% de la plus petite dimension)
      const logoSize = Math.min(splash.width, splash.height) * 0.4;

      // Redimensionner le logo
      const resizedLogo = await sharp(SOURCE_LOGO)
        .resize(Math.round(logoSize), Math.round(logoSize), {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toBuffer();

      // Superposer le logo sur le fond
      await sharp(background)
        .composite([{
          input: resizedLogo,
          gravity: 'center'
        }])
        .toFile(path.join(ICONS_DIR, splash.name));
      
      console.log(`✓ Généré ${splash.name}`);
    }

    console.log('✨ Génération des icônes terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des icônes:', error);
  }
}

generateIcons();

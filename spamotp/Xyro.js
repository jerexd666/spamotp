#!/usr/bin/env node

// ================================================================
// ===== XYRO IMAGE GENERATOR v9.9.9 - NO LIMITS =====
// ================================================================

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const Jimp = require('jimp');
const qr = require('qr-image');
const barcode = require('barcode');
const PDFDocument = require('pdfkit');
const svg = require('svg.js');
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');
const boxen = require('boxen');
const moment = require('moment');

class ImageGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, 'output', 'images');
    this.tempDir = path.join(__dirname, 'temp');
    this.settings = {
      width: 1920,
      height: 1080,
      format: 'png',
      quality: 100,
      dpi: 300
    };
    
    fs.ensureDirSync(this.outputDir);
    fs.ensureDirSync(this.tempDir);
  }

  // ================================================================
  // ===== GENERATE FROM TEXT PROMPT =====
  // ================================================================

  async generateFromPrompt(prompt, options = {}) {
    console.log(chalk.cyan(`🎨 Generating image from: "${prompt}"`));
    
    const width = options.width || this.settings.width;
    const height = options.height || this.settings.height;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    const gradientColors = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#FF9A9E', '#FECFEF', '#FDFCFB'],
      ['#F093FB', '#F5576C', '#4FACFE'],
      ['#43E97B', '#38F9D7', '#FA709A'],
      ['#FA709A', '#FEE140', '#FECFEF'],
      ['#30CFD0', '#330867', '#4FACFE'],
      ['#a18cd1', '#fbc2eb', '#f6d5f7'],
      ['#fccb90', '#d57eeb', '#f6d5f7']
    ];

    const selectedGradient = gradientColors[Math.floor(Math.random() * gradientColors.length)];
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, selectedGradient[0]);
    grad.addColorStop(0.5, selectedGradient[1]);
    grad.addColorStop(1, selectedGradient[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Generate random shapes based on prompt
    const words = prompt.toLowerCase().split(' ');
    const shapes = this.generateShapesFromWords(words, width, height);
    
    for (const shape of shapes) {
      ctx.beginPath();
      ctx.fillStyle = shape.color;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 20;
      
      if (shape.type === 'circle') {
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
      } else if (shape.type === 'rect') {
        ctx.rect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === 'triangle') {
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
        ctx.closePath();
      } else if (shape.type === 'star') {
        this.drawStar(ctx, shape.x, shape.y, shape.size);
      }
      ctx.fill();
    }

    // Add text overlay
    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Main title
    const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(title, width/2, height/2 - 30);

    // Subtitle with timestamp
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = 5;
    ctx.fillText(`Xyro AI • ${moment().format('YYYY-MM-DD HH:mm')}`, width/2, height/2 + 50);

    // Random decorative elements
    this.addDecorativeElements(ctx, width, height);

    // Generate filename
    const filename = `xyro_${Date.now()}_${uuidv4().slice(0, 8)}.${options.format || this.settings.format}`;
    const filepath = path.join(this.outputDir, filename);

    // Save image
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filepath, buffer);

    console.log(chalk.green(`✅ Image saved: ${filepath}`));
    return { success: true, filepath, filename, size: buffer.length };
  }

  // ================================================================
  // ===== GENERATE SHAPES FROM WORDS =====
  // ================================================================

  generateShapesFromWords(words, width, height) {
    const shapes = [];
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F1948A', '#82E0AA', '#F8C471', '#85C1E9', '#D7BDE2'
    ];

    for (let i = 0; i < words.length * 3 + 10; i++) {
      const type = ['circle', 'rect', 'triangle', 'star'][Math.floor(Math.random() * 4)];
      const size = Math.random() * 80 + 20;
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      shapes.push({
        type,
        x,
        y,
        size,
        w: size * 1.5,
        h: size * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    return shapes;
  }

  // ================================================================
  // ===== DRAW STAR =====
  // ================================================================

  drawStar(ctx, cx, cy, r) {
    const spikes = 5;
    const outerRadius = r;
    const innerRadius = r * 0.4;
    
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    ctx.closePath();
  }

  // ================================================================
  // ===== ADD DECORATIVE ELEMENTS =====
  // ================================================================

  addDecorativeElements(ctx, width, height) {
    // Random dots
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3 + 1,
        0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
      ctx.fill();
    }

    // Random lines
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.15 + 0.05})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }
  }

  // ================================================================
  // ===== GENERATE QR CODE =====
  // ================================================================

  async generateQR(data, options = {}) {
    const size = options.size || 500;
    const filename = `qr_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);

    const qrBuffer = qr.imageSync(data, { type: 'png', size: size });
    await fs.writeFile(filepath, qrBuffer);

    console.log(chalk.green(`✅ QR Code saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== GENERATE BARCODE =====
  // ================================================================

  async generateBarcode(data, options = {}) {
    const filename = `barcode_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);

    const barcodeData = barcode('code128', data, {
      width: options.width || 400,
      height: options.height || 150,
      fontSize: 20
    });

    await fs.writeFile(filepath, barcodeData);
    console.log(chalk.green(`✅ Barcode saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== GENERATE MEME =====
  // ================================================================

  async generateMeme(topText, bottomText, imagePath = null) {
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    if (imagePath && fs.existsSync(imagePath)) {
      const img = await loadImage(imagePath);
      ctx.drawImage(img, 0, 0, width, height);
    } else {
      // Random background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      
      // Add random shapes
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 40 + 10,
          0, Math.PI * 2
        );
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
        ctx.fill();
      }
    }

    // Add text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Top text
    ctx.font = 'bold 40px Impact, Arial Black';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    
    ctx.strokeText(topText.toUpperCase(), width/2, 20);
    ctx.fillText(topText.toUpperCase(), width/2, 20);

    // Bottom text
    ctx.textBaseline = 'bottom';
    ctx.strokeText(bottomText.toUpperCase(), width/2, height - 20);
    ctx.fillText(bottomText.toUpperCase(), width/2, height - 20);

    // Add watermark
    ctx.shadowBlur = 0;
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Xyro AI Meme Generator', 10, height - 10);

    const filename = `meme_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filepath, buffer);

    console.log(chalk.green(`✅ Meme saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== GENERATE COLLAGE =====
  // ================================================================

  async generateCollage(images, options = {}) {
    const cols = options.cols || 3;
    const rows = Math.ceil(images.length / cols);
    const thumbSize = options.size || 300;
    const width = cols * thumbSize;
    const height = rows * thumbSize;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Place images
    for (let i = 0; i < Math.min(images.length, cols * rows); i++) {
      const x = (i % cols) * thumbSize;
      const y = Math.floor(i / cols) * thumbSize;
      
      try {
        const img = await loadImage(images[i]);
        ctx.drawImage(img, x, y, thumbSize, thumbSize);
      } catch (e) {
        // Draw placeholder
        ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
        ctx.fillRect(x, y, thumbSize, thumbSize);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Image ${i+1}`, x + thumbSize/2, y + thumbSize/2);
      }
    }

    const filename = `collage_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filepath, buffer);

    console.log(chalk.green(`✅ Collage saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== GENERATE PROFILE PICTURE =====
  // ================================================================

  async generateProfilePicture(name, options = {}) {
    const size = options.size || 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();

    // Initial text
    const initial = name ? name.charAt(0).toUpperCase() : 'X';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.fillText(initial, size/2, size/2 + size * 0.05);

    // Ring
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 5;
    ctx.stroke();

    const filename = `profile_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filepath, buffer);

    console.log(chalk.green(`✅ Profile picture saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== GENERATE BANNER =====
  // ================================================================

  async generateBanner(text, options = {}) {
    const width = options.width || 1200;
    const height = options.height || 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#FF6B6B');
    grad.addColorStop(0.5, '#4ECDC4');
    grad.addColorStop(1, '#45B7D1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Pattern
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 50 + 10,
        0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1 + 0.05})`;
      ctx.fill();
    }

    // Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    
    const fontSize = Math.min(width / text.length * 1.5, 120);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.fillText(text, width/2, height/2);

    // Subtitle
    ctx.shadowBlur = 10;
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Xyro AI • Banner Generator', width/2, height/2 + fontSize/2 + 40);

    const filename = `banner_${Date.now()}.png`;
    const filepath = path.join(this.outputDir, filename);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filepath, buffer);

    console.log(chalk.green(`✅ Banner saved: ${filepath}`));
    return { success: true, filepath, filename };
  }

  // ================================================================
  // ===== BATCH GENERATE =====
  // ================================================================

  async batchGenerate(prompts, options = {}) {
    const results = [];
    const total = prompts.length;
    
    console.log(chalk.cyan(`🎨 Generating ${total} images...`));
    
    for (let i = 0; i < total; i++) {
      const prompt = prompts[i];
      console.log(chalk.gray(`[${i+1}/${total}] ${prompt}`));
      
      try {
        const result = await this.generateFromPrompt(prompt, options);
        results.push(result);
      } catch (error) {
        console.log(chalk.red(`❌ Failed: ${prompt} - ${error.message}`));
        results.push({ success: false, prompt, error: error.message });
      }
    }

    console.log(chalk.green(`✅ Batch complete: ${results.filter(r => r.success).length}/${total} success`));
    return results;
  }

  // ================================================================
  // ===== LIST OUTPUTS =====
  // ================================================================

  listOutputs() {
    const files = fs.readdirSync(this.outputDir);
    const images = files.filter(f => 
      f.match(/\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i)
    );
    
    console.log(chalk.cyan(`📁 Images in ${this.outputDir}:`));
    for (const file of images) {
      const stats = fs.statSync(path.join(this.outputDir, file));
      const size = (stats.size / 1024).toFixed(2);
      console.log(chalk.gray(`  • ${file} (${size} KB)`));
    }
    console.log(chalk.cyan(`Total: ${images.length} images`));
    return images;
  }

  // ================================================================
  // ===== CLEAN OUTPUTS =====
  // ================================================================

  cleanOutputs() {
    const files = fs.readdirSync(this.outputDir);
    let count = 0;
    
    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i)) {
        fs.unlinkSync(path.join(this.outputDir, file));
        count++;
      }
    }
    
    console.log(chalk.yellow(`🧹 Cleaned ${count} images`));
    return count;
  }
}

// ================================================================
// ===== CLI INTERFACE =====
// ================================================================

async function main() {
  console.clear();
  
  // Display banner
  console.log(gradient.passion(figlet.textSync('XYRO', { font: 'Big' })));
  console.log(gradient.retro(figlet.textSync('IMAGE GEN', { font: 'Small' })));
  
  console.log(boxen(
    `🎨 XYRO IMAGE GENERATOR v9.9.9\n` +
    `╔═══════════════════════════════════════════════╗\n` +
    `║  MODE: ${'UNLIMITED'.red} - ${'NO FILTERS'.yellow}              ║\n` +
    `║  STATUS: ${'FULL POWER'.green}                      ║\n` +
    `║  OUTPUT: ${'./output/images/'.cyan}                     ║\n` +
    `╚═══════════════════════════════════════════════╝`,
    { padding: 1, borderColor: 'cyan', borderStyle: 'double' }
  ));

  const generator = new ImageGenerator();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
  };

  while (true) {
    console.log(chalk.cyan('\n📋 Commands:'));
    console.log(chalk.gray('  1. Generate from prompt'));
    console.log(chalk.gray('  2. Generate QR Code'));
    console.log(chalk.gray('  3. Generate Barcode'));
    console.log(chalk.gray('  4. Generate Meme'));
    console.log(chalk.gray('  5. Generate Profile Picture'));
    console.log(chalk.gray('  6. Generate Banner'));
    console.log(chalk.gray('  7. Batch Generate'));
    console.log(chalk.gray('  8. List outputs'));
    console.log(chalk.gray('  9. Clean outputs'));
    console.log(chalk.gray('  0. Exit'));
    
    const choice = await askQuestion(chalk.yellow('\nSelect option: '));
    
    switch (choice) {
      case '1': {
        const prompt = await askQuestion(chalk.yellow('Enter prompt: '));
        await generator.generateFromPrompt(prompt);
        break;
      }
      case '2': {
        const data = await askQuestion(chalk.yellow('Enter QR data: '));
        await generator.generateQR(data);
        break;
      }
      case '3': {
        const data = await askQuestion(chalk.yellow('Enter barcode data: '));
        await generator.generateBarcode(data);
        break;
      }
      case '4': {
        const top = await askQuestion(chalk.yellow('Top text: '));
        const bottom = await askQuestion(chalk.yellow('Bottom text: '));
        await generator.generateMeme(top, bottom);
        break;
      }
      case '5': {
        const name = await askQuestion(chalk.yellow('Name (or leave empty): '));
        await generator.generateProfilePicture(name || 'Xyro');
        break;
      }
      case '6': {
        const text = await askQuestion(chalk.yellow('Banner text: '));
        await generator.generateBanner(text);
        break;
      }
      case '7': {
        console.log(chalk.gray('Enter prompts (one per line, empty line to finish):'));
        const prompts = [];
        while (true) {
          const line = await askQuestion('> ');
          if (!line) break;
          prompts.push(line);
        }
        if (prompts.length > 0) {
          await generator.batchGenerate(prompts);
        }
        break;
      }
      case '8': {
        generator.listOutputs();
        break;
      }
      case '9': {
        await generator.cleanOutputs();
        break;
      }
      case '0': {
        console.log(chalk.yellow('👋 Bye Master!'));
        rl.close();
        process.exit(0);
      }
      default: {
        console.log(chalk.red('❌ Invalid option'));
      }
    }
  }
}

// ================================================================
// ===== EXPORTS =====
// ================================================================

module.exports = { ImageGenerator };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// ================================================================
// ===== END OF IMAGE.JS ======
// ================================================================
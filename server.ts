import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('data.db'); // Use a file so it survives dev reloads.

// Setup Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)');
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
const getProgress = db.prepare('SELECT * FROM progress WHERE user_id = ?');
const insertProgress = db.prepare('INSERT INTO progress (user_id, module_id, score, passed) VALUES (?, ?, ?, ?)');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/users', (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'id and name are required' });
    }
    insertUser.run(id, name);
    res.json({ success: true, id, name });
  });

  app.get('/api/users/:id', (req, res) => {
    const user = getUser.get(req.params.id) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const progress = getProgress.all(req.params.id);
    res.json({ ...user, progress });
  });

  app.post('/api/progress/:userId', (req, res) => {
    const { userId } = req.params;
    const { moduleId, score, passed } = req.body;
    insertProgress.run(userId, moduleId, score, passed ? 1 : 0);
    res.json({ success: true });
  });

  app.get('/api/certificate/:userId', async (req, res) => {
    const user = getUser.get(req.params.userId) as any;
    if (!user) return res.status(404).send('User not found');

    const serialNumber = `DA-${user.id.substring(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
    const validationUrl = `${process.env.APP_URL || 'https://dataacademy.edu'}/verify/${serialNumber}`;
    
    // Generate QR Code Buffer
    const qrBuffer = await QRCode.toBuffer(validationUrl, {
      margin: 1,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    });

    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificado_DataAcademy_${user.name.replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // Background Gradient (Faking with rects)
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');

    // Ornamental Border
    doc.lineWidth(20).strokeColor('#1e3a8a').rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.lineWidth(2).strokeColor('#3b82f6').rect(35, 35, doc.page.width - 70, doc.page.height - 70).stroke();

    // Header Branding
    doc.fontSize(12).fillColor('#1e3a8a').text('DATAACADEMY GLOBAL EDUCATION', 0, 70, { align: 'center', characterSpacing: 2 });
    
    doc.moveDown(2);
    doc.fontSize(45).font('Helvetica-Bold').fillColor('#1e3a8a').text('CERTIFICADO DE EXCELENCIA', { align: 'center', characterSpacing: 1 });
    
    doc.moveDown(1.5);
    doc.fontSize(16).font('Helvetica').fillColor('#64748b').text('Se otorga la presente certificación a:', { align: 'center' });
    
    doc.moveDown(1);
    doc.fontSize(40).font('Helvetica-Bold').fillColor('#0f172a').text(user.name.toUpperCase(), { align: 'center' });
    
    doc.moveDown(1.2);
    doc.fontSize(14).font('Helvetica-Oblique').fillColor('#475569').text('Por haber completado con distinción académica el programa de formación ejecutiva integral de 15 módulos en:', { align: 'center', width: 600, indent: 0 });
    
    doc.moveDown(1);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e3a8a').text('Certificación de Data Manager', { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#3b82f6').text('Especialidad en Gobierno de Datos y Seguridad', { align: 'center' });
    
    // Signatures and QR
    const bottomY = doc.page.height - 180;
    
    // QR Code
    doc.image(qrBuffer, 60, bottomY, { width: 100 });
    doc.fontSize(8).font('Courier').fillColor('#94a3b8').text(serialNumber, 60, bottomY + 105, { width: 100, align: 'center' });

    // Signature Area
    const sealPath = path.join(process.cwd(), 'public', 'seal.png');
    try {
      doc.image(sealPath, doc.page.width - 250, bottomY - 50, { width: 100 });
    } catch (e) {
      console.warn('Seal image not found at /public/seal.png');
    }

    doc.lineWidth(1).strokeColor('#94a3b8').moveTo(doc.page.width - 320, bottomY + 80).lineTo(doc.page.width - 80, bottomY + 80).stroke();
    
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Miguel Jonathan Mogrovejo Cardenas', doc.page.width - 320, bottomY + 90, { width: 240, align: 'center' });
    doc.fontSize(8).font('Helvetica').fillColor('#64748b').text('DOCENTE ESPECIALISTA EN GOBIERNO DE DATOS Y CIBERSEGURIDAD', doc.page.width - 320, bottomY + 105, { width: 240, align: 'center' });

    // Date
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.fontSize(10).font('Helvetica').fillColor('#64748b').text(`Emitido el ${today}`, 0, doc.page.height - 60, { align: 'center' });

    doc.end();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

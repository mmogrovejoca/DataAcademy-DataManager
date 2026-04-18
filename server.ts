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
        size: [1080, 1920],
        margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificado_DataAcademy_${user.name.replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // Background
    doc.rect(0, 0, 1080, 1920).fill('#ffffff');
    
    // Bottom Accent
    doc.rect(0, 1600, 1080, 320).fill('#f8fafc');

    // Ornamental Border - Portrait
    doc.lineWidth(40).strokeColor('#1e3a8a').rect(40, 40, 1000, 1840).stroke();
    doc.lineWidth(4).strokeColor('#3b82f6').rect(70, 70, 940, 1780).stroke();

    // Custom Vector Logo - Centred at Top
    const logoX = (1080 - 180) / 2;
    const logoY = 100;
    const scale = 180 / 400;

    doc.save()
       .translate(logoX, logoY)
       .scale(scale);
    
    // Braces
    doc.path("M110,30 C70,30 60,50 60,90 L60,170 C60,210 20,225 20,225 C60,240 60,280 60,320 L60,400 C60,440 70,460 110,460 L110,400 C90,400 85,390 85,370 L85,260 C85,220 50,210 50,210 C50,210 85,200 85,160 L85,90 C85,70 90,60 110,60 Z").fill("#1e3a8a");
    doc.path("M290,30 C330,30 340,50 340,90 L340,170 C340,210 380,225 380,225 C340,240 340,280 340,320 L340,400 C340,440 330,460 290,460 L290,400 C310,400 315,390 315,370 L315,260 C315,220 350,210 350,210 C350,210 315,200 315,160 L315,90 C315,70 310,60 290,60 Z").fill("#1e3a8a");
    
    // Dual M Letters
    doc.path("M150,200 L150,70 L200,120 L250,70 L250,200 L215,200 L215,135 L200,150 L185,135 L185,200 Z").fill("#0f172a");
    doc.path("M150,420 L150,290 L200,340 L250,290 L250,420 L215,420 L215,355 L200,370 L185,355 L185,420 Z").fill("#0f172a");

    doc.restore();

    // Header Branding
    doc.fontSize(22).fillColor('#1e3a8a').text('DATAACADEMY GLOBAL EDUCATION', 0, 340, { align: 'center', characterSpacing: 4 });
    
    doc.moveTo(490, 380).lineTo(590, 380).lineWidth(4).stroke('#1e3a8a');

    // Main Title
    doc.fontSize(80).font('Helvetica-Bold').fillColor('#1e3a8a').text('CERTIFICADO DE', 0, 480, { align: 'center', characterSpacing: 2 });
    doc.fontSize(90).text('EXCELENCIA', 0, 580, { align: 'center', characterSpacing: 4 });

    // Se otorga...
    doc.fontSize(22).font('Helvetica').fillColor('#64748b').text('Se otorga la presente certificación académica a:', 0, 780, { align: 'center' });
    
    // Recipient
    doc.fontSize(80).font('Helvetica-Bold').fillColor('#0f172a').text(user.name.toUpperCase(), 0, 850, { align: 'center' });
    
    // Description
    const descWidth = 800;
    doc.fontSize(22).font('Helvetica-Oblique').fillColor('#475569').text('Por haber completado con distinción académica superior y rigor técnico el programa de formación ejecutiva integral de 15 módulos especializados en el dominio de:', (1080 - descWidth) / 2, 1050, { align: 'center', width: descWidth, lineGap: 8 });
    
    // Program
    doc.fontSize(40).font('Helvetica-Bold').fillColor('#1e3a8a').text('Certificación de Data Manager', 0, 1280, { align: 'center' });
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#3b82f6').text('Especialidad Superior en Gobierno de Datos y Ciberseguridad', 0, 1340, { align: 'center' });
    
    // Footer - Centered stacked elements for portrait
    const footerY = 1500;
    
    // Signatures Area
    const signatureY = footerY + 200;
    
    // Signature Area - Miguel
    const sealPath = path.join(process.cwd(), 'public', 'seal.png');
    try {
      doc.image(sealPath, (1080 - 200) / 2, signatureY - 180, { width: 200 });
    } catch (e) {
      console.warn('Seal image not found at /public/seal.png');
    }

    doc.lineWidth(1).strokeColor('#94a3b8').moveTo(340, signatureY).lineTo(740, signatureY).stroke();
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#0f172a').text('Miguel Jonathan Mogrovejo Cardenas', 0, signatureY + 20, { align: 'center' });
    doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('DOCENTE ESPECIALISTA EN GOBIERNO DE DATOS Y CIBERSEGURIDAD', 0, signatureY + 45, { align: 'center', characterSpacing: 1 });

    // QR Code - At the very bottom
    doc.image(qrBuffer, (1080 - 150) / 2, signatureY + 120, { width: 150 });
    doc.fontSize(10).font('Courier').fillColor('#cbd5e1').text(`Serial: ${serialNumber}`, 0, signatureY + 280, { align: 'center' });

    doc.fontSize(10).font('Helvetica').fillColor('#cbd5e1').text('VERIFIED ACADEMIC CREDENTIAL • GLOBAL VALIDATION ACTIVE', 0, 1860, { align: 'center', characterSpacing: 2 });

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

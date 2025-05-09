require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path'); 
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const machine = require('./models/kmeansModel');
const chat = require('./models/chat');
const gemini = require('./models/geminis');
const nodemailer = require("nodemailer");


const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`📥 Nueva solicitud: ${req.method} ${req.url}`);
    console.log("📩 Body recibido:", req.body);
    next();
});

app.post('/send-email', async (req, res) => {
    const { email, nombre, membresia, precio, paymentCode } = req.body;
  
    if (!email) return res.status(400).json({ error: 'Email es requerido' });
  
    try {
      const pdfPath = `factura_${paymentCode}.pdf`;
      const doc = new PDFDocument({ margin: 20, size: [200, 500] });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);
  
      const logo = "./assets/imagenes/logo.jpeg"; // asegúrate de que exista
      if (fs.existsSync(logo)) {
        doc.image(logo, 60, 0, { width: 80, align: "center" });
        doc.moveDown(5);
      }
  
      doc.fontSize(10).text("GIMNASIO VIDA FIT PRO", { align: "center" });
      doc.text("NIT: 123456789", { align: "center" });
      doc.text("Tel: 320 123 4567", { align: "center" });
      doc.moveDown();
      doc.text(`Cliente: ${nombre || 'Usuario'}`);
      doc.text(`Correo: ${email}`);
      doc.moveDown();
      doc.moveTo(10, doc.y).lineTo(190, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(10).text("Detalle de compra", { underline: true });
      doc.text(`Membresía: ${membresia}`);
      doc.text(`Precio: ${precio}`);
      doc.text(`Código de pago: ${paymentCode}`);
      doc.moveDown();
  
      //const qrData = `https://validacion.com/pago/${paymentCode}`;
      const qrData = `http://compensar-frontend-itpdlc-74359e-69-197-144-173.traefik.me/`;
      const qrImage = await QRCode.toDataURL(qrData);
      doc.image(qrImage, { width: 80, align: "center" });
      doc.moveDown(7);
      doc.text("Gracias por tu compra.", { align: "center" });
      doc.end();
  
      stream.on("finish", async () => {
        const pdfData = fs.readFileSync(pdfPath);
  
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Pago de Membresía - Vida Fit Pro',
          html: `
            <p>Hola ${nombre || 'Usuario'},</p>
            <p>Tu código de pago para la membresía <strong>${membresia}</strong> (${precio}) es: <strong>${paymentCode}</strong>.</p>
            <p>Adjuntamos la factura de tu compra en formato PDF.</p>
          `,
          attachments: [
            {
              filename: `factura_${paymentCode}.pdf`,
              content: pdfData,
            },
          ],
        };
  
        await transporter.sendMail(mailOptions);
        fs.unlinkSync(pdfPath);
        console.log("Correo enviado correctamente con Gmail.");
        res.json({ success: true });
      });
  
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: 'No se pudo completar la operación' });
    }
  });



// 📌 Ruta para guardar los CSVs
app.post("/save-csv", (req, res) => {

    
    const { userId, newCSV, allCSV } = req.body;

    // 📂 Crear la carpeta `csv` si no existe
    const csvFolderPath = path.join(__dirname, "csv");
    if (!fs.existsSync(csvFolderPath)) {
        fs.mkdirSync(csvFolderPath);
    }

    // 📌 Guardar el CSV del nuevo usuario
    const newFilePath = path.join(csvFolderPath, "nuevo_usuario.csv");
    fs.writeFileSync(newFilePath, newCSV, "utf8");

    // 📌 Guardar todas las respuestas de todos los usuarios sin sobrescribir datos
    const globalFilePath = path.join(csvFolderPath, `usuario_${userId}.csv`);

    // Si el archivo no existe, lo creamos con el encabezado
    if (!fs.existsSync(globalFilePath)) {
        fs.writeFileSync(globalFilePath, allCSV, "utf8");
        console.log("📄 Archivo creado:", globalFilePath);
    } else {
        // 📌 Leer contenido actual del CSV
        const existingContent = fs.readFileSync(globalFilePath, "utf8");
        const existingLines = existingContent.split("\n").map(line => line.trim()); // Eliminar espacios extra
    
        // 📌 Separar encabezado y datos
        const header = existingLines[0]; // Primera línea es el encabezado
        const existingData = new Set(existingLines.slice(1)); // Guardamos las líneas existentes
    
        // 📌 Omitir encabezado y agregar solo filas nuevas
        const newLines = allCSV.split("\n").slice(1).filter(line => !existingData.has(line)); 
    
        // 📌 Si hay líneas nuevas, las agregamos
        if (newLines.length > 0) {
            // 📌 Obtener la última línea del archivo
            const lastLine = existingLines[existingLines.length - 1];
    
            // 📌 Agregar nuevas líneas sin un salto de línea extra al final
            const appendData = lastLine ? `\n${newLines.join("\n")}` : newLines.join("\n");
            
            fs.appendFileSync(globalFilePath, appendData, "utf8");
            console.log(`✅ Se agregaron ${newLines.length} nuevas filas al archivo: ${globalFilePath}`);
        } else {
            console.log("🔹 No hay filas nuevas para agregar. Evitando duplicados.");
        }
    }

    res.json({
        message: "✅ CSVs guardados en la carpeta 'csv'",
        newFilePath,
        globalFilePath
    });

    try {
        const outputFilePath = path.join(csvFolderPath, 'todos_los_usuarios.csv');
        const allFiles = fs.readdirSync(csvFolderPath).filter(file => file.startsWith('usuario_') && file.endsWith('.csv'));
    
        let finalCSV = '';
        let headerAdded = false;
    
        allFiles.forEach((file, index) => {
          const filePath = path.join(csvFolderPath, file);
          const fileData = fs.readFileSync(filePath, 'utf8').trim();
    
          const lines = fileData.split('\n');
          if (index === 0) {
            finalCSV += lines.join('\n') + '\n'; // Agregamos encabezado del primer archivo
            headerAdded = true;
          } else {
            finalCSV += lines.slice(1).join('\n') + '\n'; // Omitimos encabezado de archivos posteriores
          }
        });
    
        fs.writeFileSync(outputFilePath, finalCSV, 'utf8');
        console.log('✅ Todos los CSVs fusionados en', outputFilePath);

/*         fs.unlink(globalFilePath, (err) => {
            if (err) console.error("❌ Error al eliminar archivo:", globalFilePath, err);
            else console.log("🗑️ Archivo eliminado:", globalFilePath);
        }); */
    
      } catch (error) {
        console.error('❌ Error al fusionar CSVs:', error);
        res.status(500).send('Error al fusionar CSVs');
      }
});



app.use('/api', machine);
app.use('/api', chat);
app.use('/api', gemini);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${PORT}`));

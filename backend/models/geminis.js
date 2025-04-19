const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/comida-bebidas", async (req, res) => {
    try {
        const { preferencias, restricciones } = req.body;
        console.log("📥 Request recibido:", { preferencias, restricciones });

        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ Error: Clave de API de Gemini no definida");
            return res.status(500).json({ error: "Clave de API no configurada" });
        }

        // Configurar el modelo
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Crear el prompt de consulta
        const prompt = `Recomienda una comida o bebida saludable según estas preferencias: ${preferencias}. Restricciones: ${restricciones}. Responde solo con el nombre de la comida o bebida y una breve descripción.`;
        console.log("📝 Prompt enviado a Gemini:", prompt);

        // Enviar consulta a Gemini
        const result = await model.generateContent(prompt);

        console.log("📩 Respuesta completa de Gemini:", JSON.stringify(result, null, 2));

        // Verificar si hay respuestas válidas
        if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0) {
            console.error("❌ Error: Respuesta inválida de Gemini");
            return res.status(500).json({ error: "Respuesta inválida de la IA" });
        }

        // Extraer correctamente el texto de la respuesta
        const text = result.response.candidates[0]?.content?.parts?.[0]?.text; // ✅ CORREGIDO

        console.log("✅ Recomendación generada:", text);

        res.json({ recomendacion: text });
    } catch (error) {
        console.error("❌ Error obteniendo la recomendación:", error);
        res.status(500).json({ error: "Error al obtener la recomendación." });
    }
});

module.exports = router;

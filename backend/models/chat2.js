const express = require("express");
const fs = require("fs");
const natural = require("natural");
const math = require("mathjs");

const compromise = require("compromise");
const currency = require("currency.js");
const numeral = require("numeral");
const say = require("say");
const moment = require("moment");
const { format, differenceInDays } = require("date-fns");
const { search } = require("duckduckgo-search");
const wtf = require("wtf_wikipedia");


const router = express.Router();
const DATA_FILE = "chat_data.json";
const UNANSWERED_FILE = "unanswered.json";

// Cargar datos existentes o inicializar
let data = {};
try {
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } else {
        data = {
            "hola": "¡Hola! 😊 ¿Cómo estás hoy?",
            "productos": "Nuestra aplicación ofrece recomendaciones de ejercicios, seguimiento del progreso y más. ¿En qué área necesitas ayuda?",
            "precios": "Los precios varían según el servicio. ¿Qué te interesa específicamente?",
            "horario": "Nuestro horario es:\n- 🕘 Lunes a Viernes: 6 AM - 10 PM\n- 🕗 Sábados: 8 AM - 8 PM\n- 🕖 Domingos: 9 AM - 6 PM",
            "contacto": "📩 Escríbenos a vidafit@gmail.com o 📞 llámanos al +57 3223931335.",
            "que sabes hacer": "🤖 Puedo responder preguntas sobre el gimnasio, ayudarte con entrenamientos y más. Pregunta lo que necesites.",
            "como mejorar en el gimnasio": "💪 Mantén una buena alimentación, descansa bien y aumenta la intensidad progresivamente."
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
    }
} catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    data = {};
}



const extractNames = (text) => {
    const names = compromise(text).people().out("array");
    return names.length ? `Detecté los siguientes nombres: ${names.join(", ")}` : "No encontré nombres en el mensaje.";
};

const extractNumbers = (text) => {
    const numbers = compromise(text).numbers().out("array");
    return numbers.length ? `Detecté los siguientes números: ${numbers.join(", ")}` : "No encontré números en el mensaje.";
};

const extractDates = (text) => {
    const dates = compromise(text).dates().out("array");
    return dates.length ? `Detecté las siguientes fechas: ${dates.join(", ")}` : "No encontré fechas en el mensaje.";
};

const formatMoney = (amount) => {
    return currency(amount, { symbol: "$", precision: 2 }).format();
};

const applyDiscount = (price, discount) => {
    const finalPrice = currency(price).subtract(discount);
    return `Precio final con descuento: ${finalPrice.format()}`;
};

const formatLargeNumber = (num) => {
    return numeral(num).format("0,0"); // Agrega comas
};

const formatPercentage = (num) => {
    return numeral(num).format("0.00%"); 
};


const getFormattedDate = () => {
    return format(new Date(), "dd/MM/yyyy HH:mm:ss");
};

const daysUntil = (futureDate) => {
    const today = new Date();
    const targetDate = new Date(futureDate);
    return differenceInDays(targetDate, today);
};

// Detectar idioma del mensaje
const detectLanguage = async (text) => {
    const { franc } = await import("franc");
    const langCode = franc(text);
    return langCode === "und" ? "No pude detectar el idioma" : `El mensaje está en: ${langCode}`;
};


// Buscar en Wikipedia
const searchWikipedia = async (query) => {
    const doc = await wtf.fetch(query);
    return doc ? doc.text().slice(0, 300) + "..." : "No encontré información relevante.";
};

// Buscar en Google
const searchGoogle = async (query) => {
    try {
        query = query.replace(/buscar en google/i, "").trim();
        if (!query) return "⚠️ No entiendo qué quieres buscar.";

        console.log("🔎 Buscando en DuckDuckGo:", query);
        const results = await search(query);

        return results.length > 0 ? results[0].snippet : "No encontré resultados.";
    } catch (error) {
        console.error("⚠️ Error en la búsqueda:", error);
        return "⚠️ Ocurrió un error al buscar en DuckDuckGo.";
    }
};



// Convertir texto a voz
const speakText = (text) => {
    say.speak(text);
    return "🗣️ Te lo diré en voz alta.";
};

// Obtener fecha actual
const getCurrentDate = () => moment().format("MMMM Do YYYY, h:mm:ss a");




let unanswered = {};
try {
    if (fs.existsSync(UNANSWERED_FILE)) {
        unanswered = JSON.parse(fs.readFileSync(UNANSWERED_FILE, "utf8"));
    }
} catch (error) {
    console.error("Error al leer el archivo unanswered.json:", error);
    unanswered = {};
}

const classifier = new natural.BayesClassifier();

// Entrenar el modelo
const trainModel = () => {
    classifier.docs = [];
    Object.entries(data).forEach(([question, answer]) => {
        classifier.addDocument(question.toLowerCase(), answer);
    });
    classifier.train();
};

trainModel();

// Preparar TF-IDF
const tfidf = new natural.TfIdf();
const questionsArray = Object.keys(data);

questionsArray.forEach((question) => {
    tfidf.addDocument(question);
});

const findBestMatchTFIDF = (userInput) => {
    let bestMatch = null;
    let highestScore = 0;

    tfidf.tfidfs(userInput, (i, measure) => {
        if (measure > highestScore) {
            highestScore = measure;
            bestMatch = questionsArray[i];
        }
    });

    return highestScore > 0.2 ? bestMatch : null;
};

// Función de Similaridad Coseno
const tokenizer = new natural.WordTokenizer();
const findBestMatchCosine = (userInput) => {
    let bestMatch = null;
    let highestScore = 0;

    const inputTokens = tokenizer.tokenize(userInput.toLowerCase());

    questionsArray.forEach((question) => {
        const questionTokens = tokenizer.tokenize(question.toLowerCase());
        const score = natural.JaroWinklerDistance(inputTokens.join(" "), questionTokens.join(" "));

        if (score > highestScore) {
            highestScore = score;
            bestMatch = question;
        }
    });

    return highestScore > 0.75 ? bestMatch : null;
};

// Respuestas variadas
const respuestasVariadas = {
    "hola": ["¡Hola! 😊", "¡Hey! ¿Cómo estás?", "¡Hola! ¿En qué puedo ayudarte?"],
    "productos": ["Ofrecemos ejercicios, nutrición y más.", "Tenemos muchas opciones. ¿Qué necesitas?", "¿Buscas entrenamiento o nutrición?"],
};

const getRandomResponse = (question) => {
    if (respuestasVariadas[question]) {
        const respuestas = respuestasVariadas[question];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    return data[question];
};

// Almacenamiento de sesión con expiración
const session = new Map();

const isMathExpression = (input) => {
    try {
        math.evaluate(input);
        return true;
    } catch (error) {
        return false;
    }
};

const getResponse = (userInput, userId) => {
    userInput = userInput.toLowerCase();


    

    if (session.has(userId) && userInput === "y qué más sabes?") {
        return session.get(userId);
    }

    if (userInput === "menu") {
        return "📌 Preguntas disponibles:\n- " + questionsArray.join("\n- ");
    }

    if (userInput.includes("rutina")) { 
        const rutinas = questionsArray.filter((key) => key.startsWith("rutina"));
        return rutinas.length > 0 
            ? "📌 Elige una de estas rutinas:\n" + rutinas.map((r) => `- ${r}`).join("\n") 
            : "❌ No hay rutinas disponibles en este momento.";
    }

    let bestMatch = findBestMatchTFIDF(userInput) || findBestMatchCosine(userInput) || classifier.classify(userInput);
    
    if (bestMatch && data[bestMatch]) {
        let response = getRandomResponse(bestMatch);
        session.set(userId, response);
        setTimeout(() => session.delete(userId), 600000); // Expira en 10 minutos
        return response;
    }
    

    if (unanswered[userInput]) {
        return "🤔 No tengo una respuesta aún. ¿Alguien puede responder? Usa: aprender|pregunta|respuesta";
    }

    unanswered[userInput] = true;
    fs.writeFile(UNANSWERED_FILE, JSON.stringify(unanswered, null, 4), () => {});

    return "🤔 No entiendo esa pregunta. ¿Puedes reformularla?";
};

router.post("/chat", async (req, res) => {
    console.log("📥 Mensaje recibido:", req.body.message);
    const userId = req.body.userId;
    const userInput = req.body.message.toLowerCase();
    let response;

    // Si el input es una operación matemática, calcular el resultado
    if (isMathExpression(userInput)) {
        try {
            const result = math.evaluate(userInput);
            console.log("🧮 Resultado:", result);
            return res.json({ response: `🧮 El resultado es: ${result}` });
        } catch (error) {
            console.error("Error evaluando expresión matemática:", error);
            return res.json({ response: "⚠️ No pude calcular eso. Asegúrate de que la expresión es válida." });
        }
    }

    response = getResponse(userInput, userId);

    if (userInput.startsWith("aprender|")) {
        const parts = userInput.split("|");
        if (parts.length === 3) {
            const question = parts[1].trim();
            const answer = parts[2].trim();

            data[question] = answer;
            delete unanswered[question];

            fs.writeFile(DATA_FILE, JSON.stringify(data, null, 4), () => {});
            fs.writeFile(UNANSWERED_FILE, JSON.stringify(unanswered, null, 4), () => {});

            trainModel();
            response = `✅ ¡Gracias! Ahora sé que "${question}" significa "${answer}".`;
        } else {
            response = "⚠️ Formato incorrecto. Usa: aprender|pregunta|respuesta";
        }
    }else  if (userInput.includes("fecha")) {
        response = `📆 La fecha actual es: ${getCurrentDate()}`;
    }else if (userInput.includes("fecha actual")) {
        response = `📆 La fecha actual es: ${getFormattedDate()}`;
    } else if (userInput.includes("extraer fecha")) {
        response = extractDates(userInput);
    } else if (userInput.includes("buscar en google")) {
        response = await searchGoogle(userInput.replace("buscar en google", "").trim());
    } else if (userInput.includes("buscar en wikipedia")) {
        response = await searchWikipedia(userInput.replace("buscar en wikipedia", "").trim());
    } else if (userInput.includes("convertir en voz")) {
        response = speakText(userInput.replace("convertir en voz", "").trim());
    }else if (userInput.includes("precio") || userInput.includes("$")) {
        const price = parseFloat(userInput.match(/\d+/)?.[0] || 0); // Extrae número
        response = `El precio que mencionaste es: ${formatMoney(price)}`;
    }else if (userInput.includes("cuánto falta para")) {
        const match = userInput.match(/\d{4}-\d{2}-\d{2}/); // Extrae fecha en formato YYYY-MM-DD
        if (match) {
            response = `Faltan ${daysUntil(match[0])} días para esa fecha.`;
        } else {
            response = "Por favor, ingresa una fecha en el formato YYYY-MM-DD.";
        }
    }else if (userInput.includes("quién es") || userInput.includes("nombre")) {
        response = extractNames(userInput);
    }else if (userInput.includes("qué idioma es")) {
        response = await detectLanguage(userInput.replace("qué idioma es", "").trim());
    }else if (userInput.includes("descuento")) {
        const valores = userInput.match(/\d+/g); // Extrae números del mensaje
        if (valores && valores.length >= 2) {
            const precio = parseFloat(valores[0]);
            const descuento = parseFloat(valores[1]);
            response = applyDiscount(precio, descuento);
        } else {
            response = "Por favor, ingresa el precio y el descuento en números.";
        }
    } else if (userInput.includes("formatear número")) {
        const num = parseFloat(userInput.match(/\d+/)?.[0] || 0);
        response = `Número formateado: ${formatLargeNumber(num)}`;
    }else if (userInput.includes("convertir a porcentaje")) {
        const num = parseFloat(userInput.match(/\d+(\.\d+)?/)?.[0] || 0);
        response = `El valor en porcentaje es: ${formatPercentage(num / 100)}`;
    } else if (/\d/.test(userInput)) { // Si hay un número en el mensaje
        response = extractNumbers(userInput);
    } else {
        response = getResponse(userInput, userId);
    }

    console.log("📤 Respuesta enviada:", response);
    res.json({ response });
});

module.exports = router;

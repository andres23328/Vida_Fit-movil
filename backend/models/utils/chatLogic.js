const fs = require("fs");
const natural = require("natural");
const math = require("mathjs");
const sentiment = require("sentiment");
const { removeAccents, isMathExpression, getRandomResponse } = require("./helpers");
const { loadData, saveData, unanswered, saveUnanswered } = require("./db");
const compromise = require('compromise');

let data = loadData();
let classifier = new natural.BayesClassifier();
const tfidf = new natural.TfIdf();
const tokenizer = new natural.WordTokenizer();
const sentimentAnalyzer = new sentiment();

const trainModel = () => {
    classifier = new natural.BayesClassifier();
    Object.entries(data).forEach(([q, a]) => {
        const qLow = q.toLowerCase();
        classifier.addDocument(qLow, a);
        classifier.addDocument(`${qLow}.`, a);
        classifier.addDocument(`${qLow}?`, a);
        tfidf.addDocument(q);
    });
    classifier.train();
    console.log("✅ Modelo entrenado con", Object.keys(data).length, "preguntas");
};

trainModel();

const questionsArray = Object.keys(data);

const analyzeSentiment = (input) => {
    const result = sentimentAnalyzer.analyze(input);
    return result.score;
};

const findBestMatchTFIDF = (input) => {
    let bestMatch = null;
    let score = 0;
    tfidf.tfidfs(input, (i, measure) => {
        if (measure > score) {
            score = measure;
            bestMatch = questionsArray[i];
        }
    });
    return score > 0.4 ? bestMatch : null;
};

const findBestMatchCosine = (input) => {
    let best = null;
    let max = 0;
    const tokens = tokenizer.tokenize(input.toLowerCase());
    for (let question of questionsArray) {
        const qTokens = tokenizer.tokenize(question.toLowerCase());
        const score = natural.JaroWinklerDistance(tokens.join(" "), qTokens.join(" "));
        if (score > max) {
            max = score;
            best = question;
        }
    }
    return max > 0.85 ? best : null;
};

const getBestMatchBayes = (input) => {
    const result = classifier.getClassifications(input);
    return result.length && result[0].value > 0.5 ? result[0].label : null;
};

const getResponse = (userInput, userId) => {
    userInput = removeAccents(userInput.toLowerCase());

    const sentimentScore = analyzeSentiment(userInput);
    let response = "";

    if (sentimentScore < 0) {
        response = "😞 Parece que estás un poco molesto. ¿Te gustaría hablar de eso?";
    }

    if (isMathExpression(userInput)) {
        try {
            const result = math.evaluate(userInput);
            return `🧮 El resultado es: ${result}`;
        } catch {
            return "⚠️ Error al calcular la expresión.";
        }
    }

    if (userInput === "menu") {
        return "📌 Preguntas disponibles:\n- " + questionsArray.join("\n- ");
    }

    const normalizedData = {};
    Object.keys(data).forEach(key => {
        normalizedData[removeAccents(key.toLowerCase())] = key;
    });

    if (normalizedData[userInput]) {
        return getRandomResponse(normalizedData[userInput], data);
    }

    const opcionesRelacionadas = Object.keys(normalizedData).filter((key) => {
        const score = natural.JaroWinklerDistance(userInput, key);
        return score > 0.75;
    });

    if (opcionesRelacionadas.length > 1 && opcionesRelacionadas.length < 6) {
        return `📌 Sobre "${userInput}", tengo estas opciones:\n` +
            opcionesRelacionadas.map((opt) => `- ${normalizedData[opt]}`).join("\n") +
            "\n📍 Escribe una opción exacta para más información.";
    }
    

    const matchTFIDF = findBestMatchTFIDF(userInput);
    if (matchTFIDF) return getRandomResponse(matchTFIDF, data);

    const matchCosine = findBestMatchCosine(userInput);
    if (matchCosine) return getRandomResponse(matchCosine, data);

    const matchBayes = getBestMatchBayes(userInput);
    if (matchBayes) return getRandomResponse(matchBayes, data);

    if (userInput.length > 6 && !unanswered[userInput]) {
        unanswered[userInput] = true;
        saveUnanswered();
    }

    return "🤔 No entiendo esa pregunta. ¿Puedes reformularla o enseñarme con: aprender|pregunta|respuesta?";
};

const aprender = (input) => {
    const [_, question, answer] = input.split("|");
    if (!question || !answer) return "⚠️ Formato inválido. Usa: aprender|pregunta|respuesta";

    data[question] = answer;
    delete unanswered[question];
    saveData(data);
    saveUnanswered();
    trainModel();

    return `✅ ¡Gracias! Aprendí que "${question}" significa "${answer}".`;
};

module.exports = { getResponse, aprender };

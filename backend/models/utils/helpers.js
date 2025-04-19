const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const isMathExpression = (input) => {
    const math = require("mathjs");
    try {
        math.evaluate(input);
        return true;
    } catch {
        return false;
    }
};

const respuestasVariadas = {
    "hola": ["¡Hola! 😊", "¡Hey! ¿Cómo estás?", "¡Hola! ¿En qué puedo ayudarte?"],
    "productos": ["Ofrecemos ejercicios, nutrición y más.", "¿Buscas entrenamiento o nutrición?"],
};

const getRandomResponse = (key, data) => {
    if (respuestasVariadas[key]) {
        const r = respuestasVariadas[key];
        return r[Math.floor(Math.random() * r.length)];
    }
    return data[key];
};

module.exports = { removeAccents, isMathExpression, getRandomResponse };

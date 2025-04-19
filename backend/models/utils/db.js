const fs = require("fs");
const DATA_FILE = "./models/data/chat_data.json";
const UNANSWERED_FILE = "./models/data/unanswered.json";

let unanswered = {};
let loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    }
    const initial = {
        "hola": "¡Hola! 😊 ¿Cómo estás hoy?",
        "productos": "Ofrecemos rutinas, nutrición y más.",
        "precios": "Los precios dependen del servicio.",
        "horario": "Lunes a Viernes: 6am - 10pm.",
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 4));
    return initial;
};

const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
};

if (fs.existsSync(UNANSWERED_FILE)) {
    unanswered = JSON.parse(fs.readFileSync(UNANSWERED_FILE));
}

const saveUnanswered = () => {
    fs.writeFileSync(UNANSWERED_FILE, JSON.stringify(unanswered, null, 4));
};

module.exports = { loadData, saveData, unanswered, saveUnanswered };

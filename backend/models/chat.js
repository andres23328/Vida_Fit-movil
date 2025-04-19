const express = require("express");
const { getResponse, aprender } = require("./utils/chatLogic");

const router = express.Router();

router.post("/chat", (req, res) => {
    const userId = req.body.userId;
    const userInput = req.body.message.trim().toLowerCase();
    let response;

    if (userInput.startsWith("aprender|")) {
        response = aprender(userInput);
    } else {
        response = getResponse(userInput, userId);
    }

    console.log("📤 Respuesta enviada:", response);
    res.json({ response });
});

module.exports = router;

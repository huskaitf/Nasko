const firebase = require("firebase");
require('dotenv').config();

let fire = () => {
    let configF = {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        databaseURL: process.env.FB_DATABASE_URL,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORE_BUCKET,
        messagingSenderId: process.env.FB_MESSAGE_SEND_ID,
        appId: process.env.FB_APP_ID,
        measurementId: process.env.FB_MEAS_ID
    };
    
    try {
        firebase.initializeApp(configF);
        console.log(`[BANCO-DE-DADOS] - Firebase Realtime conectado com sucesso!`);
    } catch (error) {
        return console.log(`[BANCO-DE-DADOS] - Firebase Realtime não foi conectado devido ao erro: ${error}`); 
    };
};

module.exports = fire;

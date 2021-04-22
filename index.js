const express = require("express");
const app = express();

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`[INFO] Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(process.env.PORT);

const Discord = require("discord.js");
const fs = require("fs");

require('dotenv').config();

const firebase = require("firebase");
const { sep } = require("path");
const fire = require("./modules/firebase.js");
const fetch = require("node-fetch");
const numberFormatter = require("number-formatter");

fire();

const client = new Discord.Client({ ws: { intents: new Discord.Intents().ALL, fetchAllMembers: true } });

const database = firebase.database();
const config = require("./json/src/config.json");
const emojis = require("./json/emojis.json");
const colors = require("./json/colors.json");

client.commands = new Discord.Collection();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log(`[EVENTOS] O Evento ${eventName} foi carregado com sucesso;`);
  });
});

const load = (dir = "./commands/") => {
  fs.readdirSync(dir).forEach(dirs => {
    const commandFiles = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`${dir}/${dirs}/${file}`);
      client.commands.set(command.name, command);
      console.log(`[COMANDOS] O comando ${command.name} foi carregado com sucesso;`);
    }
  });
};

load();

client.login(process.env.TOKEN);
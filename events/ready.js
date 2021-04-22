const Discord = require("discord.js");

module.exports = async (client) => {
    const ping = new Date();
    ping.setHours(ping.getHours() - 3);
    
    let status = [
        {name: `${client.guilds.cache.size} servidores`, type: 'WATCHING'},
        {name: `${client.commands.size} Comandos!`, type: 'WATCHING'},
        {name: `Estou online á ${uptime}`, type: "LISTENING"},
        {name: 'Siga Huskai no Twitter @huskai_coffee', type: "STREAMING", url: "https://www.twitch.tv/deibed12"},
        {name: 'my developer is Huskai', type: "PLAYING"}, 
        {name: `biscoito ou bolacha?`, type: "STREAMING", url: "https://www.twitch.tv/deibed12"},
        {name: `Miss you`, type: 'WATCHING'},
        {name: `Mateus is suspicious`, type: 'LISTENING'}
    ]; 
    function setStatus() {
        let randomStatus = status[Math.floor(Math.random()*status.length)]
        client.user.setPresence({activity: randomStatus})
    };

    setStatus();
    setInterval(() => setStatus(), 5000);
  
    console.log(`[LOGIN] - O Bot ${client.user.tag} foi inicializada em ${client.guilds.cache.size} servidores!`);
};
const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "",
    category: "",
    guildOnly: true,
    ClientPerm: ["EMBED_LINKS"],
    cooldown: 3,
    blacklist: true,
    async execute(client, message, args, emojis, colors, config, prefix){
        const m = await message.channel.send(`🏓 **|** Pong`).then(msg => msg.delete({timeout: 2000}));
  
        const embed = new Discord.MessageEmbed()
            .setColor(colors.discord)
            .setTitle(`📶 **|** Latência do Servidor`)
            .setDescription(`📡 Latência do Servidor: **${m.createdTimestamp - message.createdTimestamp}ms**` +
            `\n📡 Latência do API: **${Math.round(client.ws.ping)}ms**`)
            .setTimestamp();
 
        setTimeout(() => {  message.channel.send(embed) }, 1000);
    },
};

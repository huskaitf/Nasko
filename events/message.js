const Discord = require("discord.js");
const firebase = require("firebase");
const database = firebase.database();
const ms = require("parse-ms");

const config = require("../json/src/config.json");
const developer = require("../config/developers.js");
const guildblacklist = require("../config/blacklist.js");

const emojis = require("../json/emojis.json");
const colors = require("../json/colors.json");
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    let prefix;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
        prefix = config.prefix;
    } else {
        prefix = await database.ref(`Servidores/${message.guild.id}/Config/Prefix`).once("value").then(async function (db) {
            if (db.val() == null) {
                return config.prefix;
            } else {
                return db.val().prefix;
            };
        });
    };

    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return message.channel.send(` **|** ${message.author}, meu prefixo nesse servidor é \`${prefix}\`, use o comando \`${prefix}help\` para ver todos os meus comandos.`);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/); // Define os argumentos de entrada de um comando
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Esse comando não pode ser executado na **DM**.`).then(msg => { msg.delete({ timeout: 7000 }) });
    };

    if (guildblacklist.includes(message.guild.id)) {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode executar comandos nesse servidor, pois esse servidor está banido de usar meus comandos.`).then(msg => { msg.delete({ timeout: 7000 }) });
    };

    let ListMemberBan = await database.ref(`BlackList/${message.author.id}`).once("value").then(async function (db) {
        if (!db.val() || db.val().reason == null) {
            return null;
        } else {
            return db.val().reason;
        };
    });

    if (command.blacklist && ListMemberBan != null) {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode realizar meus comandos, pois você foi **Banido** de usar meus comando! ${emojis.catnotlike} **|** **Motivo:** ${ListMemberBan}`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (command.MemberPerm && !message.member.permissions.has(command.MemberPerm)) {
        let permissions = [];

        // VERIFICAÇÃO DE PERMISSÕES DO MEMBRO

        if (command.MemberPerm.includes('ADMINISTRATOR')) permissions.push('`Administrador`');
        if (command.MemberPerm.includes('VIEW_AUDIT_LOG')) permissions.push('`Ver o registro de auditoria`');
        if (command.MemberPerm.includes('MANAGE_GUILD')) permissions.push('`Gerenciar servidor`');
        if (command.MemberPerm.includes('MANAGE_ROLES')) permissions.push('`Gerenciar cargos`');
        if (command.MemberPerm.includes('MANAGE_CHANNELS')) permissions.push('`Gerenciar canais`');
        if (command.MemberPerm.includes('KICK_MEMBERS')) permissions.push('`Expulsar membros`');
        if (command.MemberPerm.includes('BAN_MEMBERS')) permissions.push('`Banir membros`');
        if (command.MemberPerm.includes('CREATE_INSTANT_INVITE')) permissions.push('`Criar convite`');
        if (command.MemberPerm.includes('CHANGE_NICKNAME')) permissions.push('`Alterar apelido`');
        if (command.MemberPerm.includes('MANAGE_NICKNAMES')) permissions.push('`Gerenciar apelidos`');
        if (command.MemberPerm.includes('MANAGE_EMOJIS')) permissions.push('`Gerenciar emojis`');
        if (command.MemberPerm.includes('MANAGE_WEBHOOKS')) permissions.push('`Gerenciar webhooks`');
        if (command.MemberPerm.includes('VIEW_CHANNEL')) permissions.push('`Ler canais de texto e ver canais de voz`');
        if (command.MemberPerm.includes('SEND_MESSAGES')) permissions.push('`Enviar mensagens`');
        if (command.MemberPerm.includes('SEND_TTS_MESSAGES')) permissions.push('`Enviar mensagens em TTS`');
        if (command.MemberPerm.includes('MANAGE_MESSAGES')) permissions.push('`Gerenciar mensagens`');
        if (command.MemberPerm.includes('EMBED_LINKS')) permissions.push('`Inserir links`');
        if (command.MemberPerm.includes('ATTACH_FILES')) permissions.push('`Anexar arquivos`');
        if (command.MemberPerm.includes('READ_MESSAGE_HISTORY')) permissions.push('`Ver histórico de mensagens`');
        if (command.MemberPerm.includes('MENTION_EVERYONE')) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
        if (command.MemberPerm.includes('USE_EXTERNAL_EMOJIS')) permissions.push('`Usar emojis externos`');
        if (command.MemberPerm.includes('ADD_REACTIONS')) permissions.push('`Adicionar reações`');
        if (command.MemberPerm.includes('CONNECT')) permissions.push('`Conectar`');
        if (command.MemberPerm.includes('SPEAK')) permissions.push('`Falar`');
        if (command.MemberPerm.includes('STREAM')) permissions.push('`Vídeo`');
        if (command.MemberPerm.includes('MUTE_MEMBERS')) permissions.push('`Silenciar membros`');
        if (command.MemberPerm.includes('DEAFEN_MEMBERS')) permissions.push('`Ensurdecer membros`');
        if (command.MemberPerm.includes('MOVE_MEMBERS')) permissions.push('`Mover membros`');
        if (command.MemberPerm.includes('USE_VAD')) permissions.push('`Usar detecção de voz`');
        if (command.MemberPerm.includes('PRIORITY_SPEAKER')) permissions.push('`Voz Prioritária`');

        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode executar esse comandos, pois você precisa das permissões de ${permissions.join(", ")}.`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (command.ClientPerm && !message.guild.members.cache.get(client.user.id).permissions.has(command.ClientPerm)) {
        let permissions = [];

        // VERIFICAÇÃO DE PERMISSÕES DO CLIENTE

        if (command.ClientPerm.includes('ADMINISTRATOR')) permissions.push('`Administrador`');
        if (command.ClientPerm.includes('VIEW_AUDIT_LOG')) permissions.push('`Ver o registro de auditoria`');
        if (command.ClientPerm.includes('MANAGE_GUILD')) permissions.push('`Gerenciar servidor`');
        if (command.ClientPerm.includes('MANAGE_ROLES')) permissions.push('`Gerenciar cargos`');
        if (command.ClientPerm.includes('MANAGE_CHANNELS')) permissions.push('`Gerenciar canais`');
        if (command.ClientPerm.includes('KICK_MEMBERS')) permissions.push('`Expulsar membros`');
        if (command.ClientPerm.includes('BAN_MEMBERS')) permissions.push('`Banir membros`');
        if (command.ClientPerm.includes('CREATE_INSTANT_INVITE')) permissions.push('`Criar convite`');
        if (command.ClientPerm.includes('CHANGE_NICKNAME')) permissions.push('`Alterar apelido`');
        if (command.ClientPerm.includes('MANAGE_NICKNAMES')) permissions.push('`Gerenciar apelidos`');
        if (command.ClientPerm.includes('MANAGE_EMOJIS')) permissions.push('`Gerenciar emojis`');
        if (command.ClientPerm.includes('MANAGE_WEBHOOKS')) permissions.push('`Gerenciar webhooks`');
        if (command.ClientPerm.includes('VIEW_CHANNEL')) permissions.push('`Ler canais de texto e ver canais de voz`');
        if (command.ClientPerm.includes('SEND_MESSAGES')) permissions.push('`Enviar mensagens`');
        if (command.ClientPerm.includes('SEND_TTS_MESSAGES')) permissions.push('`Enviar mensagens em TTS`');
        if (command.ClientPerm.includes('MANAGE_MESSAGES')) permissions.push('`Gerenciar mensagens`');
        if (command.ClientPerm.includes('EMBED_LINKS')) permissions.push('`Inserir links`');
        if (command.ClientPerm.includes('ATTACH_FILES')) permissions.push('`Anexar arquivos`');
        if (command.ClientPerm.includes('READ_MESSAGE_HISTORY')) permissions.push('`Ver histórico de mensagens`');
        if (command.ClientPerm.includes('MENTION_EVERYONE')) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
        if (command.ClientPerm.includes('USE_EXTERNAL_EMOJIS')) permissions.push('`Usar emojis externos`');
        if (command.ClientPerm.includes('ADD_REACTIONS')) permissions.push('`Adicionar reações`');
        if (command.ClientPerm.includes('CONNECT')) permissions.push('`Conectar`');
        if (command.ClientPerm.includes('SPEAK')) permissions.push('`Falar`');
        if (command.ClientPerm.includes('STREAM')) permissions.push('`Vídeo`');
        if (command.ClientPerm.includes('MUTE_MEMBERS')) permissions.push('`Silenciar membros`');
        if (command.ClientPerm.includes('DEAFEN_MEMBERS')) permissions.push('`Ensurdecer membros`');
        if (command.ClientPerm.includes('MOVE_MEMBERS')) permissions.push('`Mover membros`');
        if (command.ClientPerm.includes('USE_VAD')) permissions.push('`Usar detecção de voz`');
        if (command.ClientPerm.includes('PRIORITY_SPEAKER')) permissions.push('`Voz Prioritária`');

        return message.channel.send(`${emojis.no} **|** ${message.author}, Eu não posso executar esse comandos, pois eu preciso das permissões de ${permissions.join(", ")} nesse servidor.`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (command.developer && !developer.includes(message.author.id)) {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode usar esse comando, pois esse comando só pode ser executado por meus **Desenvolvedores**!`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    let ListPremium = await database.ref(`Premium/${message.author.id}`).once("value").then(async function (db) {
        if (db.val() == null || db.val().premium == null || db.val().premium == false) {
            return null;
        } else {
            return db.val().premium;
        };
    });

    if (command.premium && ListPremium == null) {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode executar esse comando, pois esse comando só está liberado para **Usuários Premiuns**!`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (command.nsfw && !message.channel.nsfw) {
        return message.channel.send(`${emojis.no} **|** ${message.author}, Você não pode executar esse comando nesse canal, pois esse comando só pode ser executado em canais de **NSFW**!`).then(msg => { msg.delete({ timeout: 15000 }) });
    };

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`${emojis.no} **|** ${message.author}, por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de realizar o comando \`${command.name}\`.`).then(msg => { msg.delete({ timeout: 5000 }) });
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(client, message, args, emojis, colors, config, prefix);

        let argumentos = args.join(" ");
        if (!argumentos) {
            argumentos = "Argumentos não foram usados nesse comando.";
        };

        console.log(`[COMANDO-USADO] (${message.author.tag} / ${message.author.id}) usou o comando "${command.name}":\n | [Shard]: ${message.guild.shardID}\n | [Servidor]: ${message.guild.name} / ${message.guild.id}\n | [Canal]: ${message.channel.name} / ${message.channel.id}\n | [Argumentos]: ${argumentos}`)
    } catch (error) {
        console.log(`[ERRO] Ocorreu um erro ao executar o comando. Erro: ${error}`);
        return message.channel.send(`${emojis.no} **|** ${message.author}, Ocorreu um erro ao executar esse comando, recomendo você reportar esse erro no servidor de suporte para meus desenvolvedores.`).then(msg => { msg.delete({ timeout: 5000 }) });
    };

};

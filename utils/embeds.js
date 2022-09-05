const discord = require("discord.js");
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname.split('utils')[0]}manifest.json`));

const newEmbed = (title, desc) => {
    return new discord.EmbedBuilder()
    .setColor(config.color)
    .setTitle(title)
    .setDescription(desc)
    .setTimestamp()
    .setFooter({text: config.author});
}

const newError = (code) => {
    return new discord.EmbedBuilder()
    .setColor(config.color)
    .setTitle("There was an error in executing the command.")
    .setDescription("Execute ?error <code> to view more information on reporting the problem.")
    .setTimestamp()
    .setFooter({text: code});
}



module.exports = { embed: newEmbed, error: newError };
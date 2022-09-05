const embeds = require('../utils/embeds');

const ping = async message => {
    const deleteAfter = await message.channel.send("Calculating...");

    let channel_embed =  await embeds.embed("Pong.", `Response latency is ${deleteAfter.createdTimestamp - message.createdTimestamp}ms.`)

    await message.channel.send({embeds: [channel_embed]});

    (await deleteAfter).delete();

    return;
}

module.exports = { execute: ping };
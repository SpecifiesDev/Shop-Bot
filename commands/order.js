const embeds = require('../utils/embeds');
const logger = require('../utils/logger');
const { ChannelType } = require('discord.js');

const order = async (message, manager, client) => {

    let cid = message.author.id;



    manager.getOrderNumber(cid, async (res, err, code) => {

        // if there was an issue with getting the order, handle the error logging
        if (err) {
            logger.error(err);
            await message.channel.send({
                embeds: [embeds.error(code)]
            });
            return
        }

        if (res == null || !res || res.length == 0) {

            // generate an order number
            let orderNumber = getRandom(1, 100000);

            // populate the order than handle the return functionality
            manager.populateOrder(cid, orderNumber, async (err, code) => {

                // if there was an issue, handle general logging
                if (err) {
                    logger.error(err);
                    await message.channel.send({
                        embeds: [embeds.error(code)]
                    });
                    return;
                }

                // surround in try / catch, esp since this is an iffy area of intents


                // create the private channel
                message.guild.channels.create({
                    name: `order-${orderNumber}`,
                    type: ChannelType.GuildText,
                }).then(async channel => {

                    // move the channel to the orders category, probably going to make this configurable via our mf.json
                    await channel.setParent('1015950001920278548');

                    // overwrite view permissions
                    channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: false });
                    channel.permissionOverwrites.edit(message.author.id, { ViewChannel: true });

                    // send a generic order placing message in the new channel
                    await channel.send({embeds: [embeds.embed("Place your order.", "Hello! Welcome to the order placing channel. Here you may either order precustoms (by id) or make a custom order by talking with our staff. Everything regarding your order from creation to shipping will be done here.")]});

                    // send a message in the executing channel that directs the user to the newly created channel
                    await message.channel.send({embeds: [embeds.embed("We've opened up an order ticket!", `Thanks for wanting to place an order with us. Head on over to <#${channel.id}> and let our staff know what you want!`)]});

                }).catch(async err => {

                    // log the error to our logging system.
                    await logger.error(err);

                    // send the discord api error code
                    await channel.send({embeds: [embeds.error("DC-4API-OR")]})

                });




            });


        }
        // the user already has an order open, deny creation. This will stop channel spamming.
        else {
            await message.channel.send({
                embeds: [embeds.embed("Order Open", "You already have an order open.")]
            });
        }

    });

    return;
}

const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    execute: order
};
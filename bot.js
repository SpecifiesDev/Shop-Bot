// import our necessary libraries
const fs = require('fs');
const discord = require ('discord.js');

// import local utilities or data managers
const logger = require('./utils/logger.js');
const manager = require('./utils/SQLManager');

// parse our config via the manifest file
const config = JSON.parse(fs.readFileSync('./manifest.json'));

// grab our configuration values from the manifest
const prefix = config.prefix;
const token = config.token;
const activity = config.bot_values.activity;





// create a client object
const client = new discord.Client({
    // declare our gateway intents
    partials: [ 'MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Object.keys(discord.IntentsBitField.Flags),
        discord.IntentsBitField.Flags.Guilds,
        discord.IntentsBitField.Flags.GuildWebhooks,
        discord.IntentsBitField.Flags.GuildIntegrations,
        discord.IntentsBitField.Flags.GuildMessageTyping
    ]
});

// create a map to store runnable commands
let commands = new Map();

// loop through the command directory and load runnable commands
for(let file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) { 
    commands.set(file.split('.js')[0], require(`./commands/${file}`));
}

// once the client is ready, log some key things and set activity
client.on('ready', () => {

    // log that the shop is online
    logger.info("The Lilac Lullaby shop is online.");

    // set the user activity
    client.user.setActivity(`${activity}`);

    // create the necessary tables in our database



    manager.deleteTable("orders", err => {

        manager.createTables(err => {

            if(err) return logger.error(err);
        
            logger.info("All tables have been created.");
        
        });
    })







});

// on message event, process

client.on('messageCreate', async message => {


    // just return if the message is from the bot.
    if(message.author.bot) return;

    // create objects of values we may need.
    let content = message.content;
    let guildId; // don't intstatinate until we make sure the message was sent in a guild channel

    // check if in a guild. note, commands should all run null checks if their intended functionality is inside of a guild channel, requiring guild information.
    if(!(message.channel.type === 'dm')) guildId = message.guildId;




    // if the message contains our command prefix
    if(content.indexOf(prefix) == 0) {
        // first we parse the message (including the command executed)
        const args = content.slice(prefix).trim().split(/ +/g);

        // grab the parsed command
        const command = args[0].toLowerCase();

        // finally, remove the command from arguments because we no longer need it
        args.shift();

        // finally we just manually create our commands in case the take special
        // data managers or anything to ease any process of this.

        if(command === `${prefix}ping`) commands.get('ping').execute(message);
        if(command === `${prefix}order`) commands.get('order').execute(message, manager, client);

    }

});

client.login(token);
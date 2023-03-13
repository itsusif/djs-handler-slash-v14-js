const fs = require('fs');
const ascii = require('ascii-table');
let table = new ascii(`Commands`);
table.setHeading('Command', 'Load Status');
const { LoadFiles } = require('../../functions/fileloader')
module.exports = {
    name: "restartsl",
    description: `Restart the bot.`,
    aliases: [],
    async execute(client, message, args) {
        try {
            await LoadFiles('bot/SlashCommands')
            fs.readdirSync('./bot/SlashCommands').forEach((folder) => {
                const commandFiles = fs.readdirSync(`./bot/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    let command = require(`../../SlashCommands/${folder}/${file}`);
                    if (command.name) {
                        client.slashCommands.set(command.name, command);
                        table.addRow(file, '✅');
                    } else {
                        table.addRow(file, '❌');
                        continue;
                    }
                }
            });
            message.reply(`\`\`\`${table.toString()}\`\`\``)
        } catch (err) {
            console.log(err)
        }
    },
};
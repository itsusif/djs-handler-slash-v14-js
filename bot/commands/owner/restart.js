const fs = require('fs');
const ascii  = require('ascii-table');
let table = new ascii(`Commands`);
table.setHeading('Command', 'Load Status');
const { LoadFiles } = require('../../functions/fileloader')
module.exports = {
    name: "restart",
    description: `Restart the bot.`,
    aliases: [],
    async execute(client, message, args) {
        try {
            await LoadFiles('bot/commands')
            fs.readdirSync('./bot/commands').forEach((folder) => {
                const commandFiles = fs.readdirSync(`./bot/commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    let command = require(`../../commands/${folder}/${file}`);
                    if (command.name) {
                        client.commands.set(command.name, command);
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
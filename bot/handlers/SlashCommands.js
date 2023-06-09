const fs = require('fs');
const ascii = require('ascii-table');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId } = require('../config.json')
let table = new ascii(`SlashCommands`);
table.setHeading('Commands', 'Load Status');

module.exports = (client) => {
    fs.readdirSync('./bot/SlashCommands').forEach((folder) => {
        const commandFiles = fs.readdirSync(`./bot/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../SlashCommands/${folder}/${file}`);
            if (command.name) {
                client.slashCommands.set(command.name, command);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, '❌');
                continue;
            }
        }
    });
    const token = process.env.token;
    const commands = client.slashCommands.map(({ execute, ...data }) => data);
    const rest = new REST({ version: '10' }).setToken(token);
    rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    ).then(() => console.log('Successfully registered application commands.'))
        .catch(console.error)
    console.log(table.toString());
    console.log(`Successfully reloaded ${commands.length} slash commands!`);
}
const fs = require('fs');

module.exports = {
    LoadFiles: async function (dirName) {
        try {
            fs.readdirSync(`./${dirName}`).forEach(async (folder) => {
                const commandFiles = await fs.readdirSync(`./${dirName}/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    delete require.cache[require.resolve(`../../${dirName}/${folder}/${file}`)]
                }
            });
        } catch (err) {
            console.log(err)
        }
    },
}
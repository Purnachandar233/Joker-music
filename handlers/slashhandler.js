let slash = [];
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Slash Commands");
table.setHeading('Command', ' Status ');
module.exports = (client) => {
    readdirSync("./SlashCommands/").forEach(dir => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../SlashCommands/${dir}/${file}`);
            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                slash.push(pull);
                table.addRow(file, 'Ready');
            } else {
                table.addRow(file, `Command Has An Error`);
                continue;
             }
          }
    });
    console.log(table.toString());
        client.on("ready", async ()=> {
    await client.application.commands.set(slash)
 })
}

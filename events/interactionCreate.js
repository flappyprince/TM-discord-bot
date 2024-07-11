const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    const { cooldowns } = interaction.client;
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, null);
    }

    const now = Date.now();
    const cooldownEndTime = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (cooldownEndTime && now < cooldownEndTime) {
        const expiredTimestamp = Math.round(cooldownEndTime / 1000);
        return interaction.reply({ content: `Please wait, the command \`${command.data.name}\` is on cooldown. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
    }

    cooldowns.set(command.data.name, now + cooldownAmount);
    setTimeout(() => cooldowns.set(command.data.name, null), cooldownAmount);

    // Place the rest of your command execution logic here

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};

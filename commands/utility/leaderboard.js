const { SlashCommandBuilder } = require('discord.js');
const { fetchLeaderBoard } = require('./../../fetchLeaderBoard');
const { leaderBoardEmbed } = require('../../embedBuilder');

module.exports = {
    cooldown: 15,
	data: new SlashCommandBuilder()
		.setName('lb')
		.setDescription('shows the leaderboard for the current campaign')
		.addStringOption(option =>
			option.setName('map')
				.setDescription('select map to show leaderboard for')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const map = interaction.options.getString('map');
		
		console.log(`${interaction.user.tag} requested map ${map} in #${interaction.channel.name} of ${interaction.guild.name}`)
		const leaderboard = await fetchLeaderBoard(map);
		const campaignArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10','11', '12', '13', '14', '15', '16', '17', '18', '19', '20','21', '22', '23', '24', '25'];
		if(!campaignArray.includes(map)){
			await interaction.followUp(`Not a valid map, use one of the following values: ${campaignArray.toString()}`);
		} 
		else if(leaderboard === null){
			await interaction.followUp('Error: failed fetching records from Nadeo');
		} 
		else {			
			const embed = leaderBoardEmbed(leaderboard, map)
			await interaction.followUp({ embeds: [embed] });
		}
	},	
};

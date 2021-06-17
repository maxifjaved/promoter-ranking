const inquirer = require("inquirer");

const { setupSpotify, getIdFromLink, getPlaylistData } = require("./helper");

var questions = [
	{
		type: "input",
		name: "mainstream",
		message: "Enter mainstream url 🔗)",
	},
	{
		type: "input",
		name: "promoters",
		message: "Enter promoter's urls 🔗,🔗 Comma separated?",
	},
];

const main = async () => {
	try {
		inquirer.prompt(questions).then(async (answers) => {
			const mainstreamUrl = answers["mainstream"];
			const promotersUrl = answers["promoters"];
			const promotersUrlWithoutSpace = (promotersUrl || "").replace(/\s/g, "");
			const promotersUrlList = promotersUrlWithoutSpace.split(",");

			await setupSpotify();
			const mainstreamPlaylist = await getPlaylistData(
				getIdFromLink(mainstreamUrl)
			);

			if (promotersUrlList.length) {
				for (const item of promotersUrlList) {
					const playlist = await getPlaylistData(getIdFromLink(item));
				}
			}
		});
	} catch (error) {
		console.log("🚀 ~ file: index.js ~ line 34 ~ main ~ error", error);
	}
};

main();

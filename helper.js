const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
	clientId: "608f183fa2574f8c8b33427208b47fef",
	clientSecret: "5aa2c628ccac4754a420d107e9cf2307",
});
const setupSpotify = async () => {
	try {
		let data = await spotifyApi.clientCredentialsGrant();
		spotifyApi.setAccessToken(data.body["access_token"]);
	} catch (error) {
		throw Error(`Error, ${error}`);
	}
};

const getIdFromLink = (url = "") => {
	const baseUrl = "https://open.spotify.com/playlist/";
	if (url.indexOf(baseUrl) > -1) {
		return url.replace(baseUrl, "");
	}
};

const getPlaylistData = async (playlistId) => {
	try {
		const data = await spotifyApi.getPlaylist(playlistId);
		return data.body;
	} catch (error) {
		throw Error(`Error, ${error}`);
	}
};
module.exports = {
	setupSpotify,
	getIdFromLink,
	getPlaylistData,
};

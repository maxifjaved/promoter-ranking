const inquirer = require("inquirer");
const { isBefore, differenceInDays } = require("date-fns");

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

      let mainstreamTracks = {};

      const mainstreamPlaylist = await getPlaylistData(
        getIdFromLink(mainstreamUrl)
      );

      for (const item of mainstreamPlaylist?.tracks?.items) {
        mainstreamTracks[item.track.uri] = item;
      }

      let totalPromoted = {};
      let playlistTrackDuration = {};

      if (promotersUrlList.length) {
        for (const promoterUrl of promotersUrlList) {
          const pId = getIdFromLink(promoterUrl);
          totalPromoted[pId] = 0;
          playlistTrackDuration[pId] = 0;
          const playlist = await getPlaylistData(pId);
          for (const item of playlist?.tracks?.items) {
            if (
              mainstreamTracks[item.track.uri] &&
              isBefore(
                new Date(mainstreamTracks[item.track.uri].added_at),
                new Date(item.added_at)
              )
            ) {
              totalPromoted[pId] = totalPromoted[pId] + 1;
              const diffInDays = differenceInDays(
                new Date(),
                new Date(item.added_at)
              );
              if (playlistTrackDuration[pId] < diffInDays) {
                playlistTrackDuration[pId] = diffInDays;
              }
            }
          }
        }
      }

      console.log("🚀 totalPromoted", totalPromoted);
      console.log("🚀 ~playlistTrackDuration", playlistTrackDuration);
    });
  } catch (error) {
    console.log("🚀 ~ file: index.js ~ line 34 ~ main ~ error", error);
  }
};

main();

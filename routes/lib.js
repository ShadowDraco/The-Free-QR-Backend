const mongoose = require("mongoose");
const QRModel = require("../models/qr");
const StatsModel = require("../models/stats");

const checkForBadURLS = (url, code) => {
  let badURL = false;
  const loweredURL = url.toLowerCase();
  const loweredCode = code.toLowerCase();
  badURLS.forEach((badUrl) => {
    const loweredBadUrl = badUrl.toLowerCase();
    if (
      loweredURL.includes(loweredBadUrl) ||
      loweredCode.includes(loweredBadUrl)
    ) {
      badURL = true;
    }
  });
  return badURL;
};

const detectDuplicateQR = async (url, code) => {
  let duplicateQR;
  try {
    duplicateQR = await QRModel.find({ url: url, code: code });
  } catch (error) {
    console.error("There was an error detecting duplicate QR");
  }

  if (duplicateQR.length > 0) {
    return true;
  }

  return false;
};

const saveQRToDatabase = async (newQR) => {
  const document = await QRModel.create({ ...newQR });
};

const updateScansInDatabase = async () => {
  const stats = await StatsModel.findOneAndUpdate({}, { $inc: { scans: 1 } });
};

const updateQRsInDatabase = async () => {
  const stats = await StatsModel.findOneAndUpdate({}, { $inc: { created: 1 } });
};

const updateQRCount = async (QR) => {
  const updated = await StatsModel.findOneAndUpdate(
    { QR },
    { $inc: { count: 1 } }
  );
};

const getAllQRsFromDatabase = async () => {
  const allDocuments = await QRModel.find({ protected: false }).exec();
  return allDocuments;
};

const getGroupFromDatabase = async (code) => {
  let qrGroup;

  if (code) {
    qrGroup = await QRModel.find({ code: code }).exec();
  } else {
    qrGroup = await QRModel.find({ protected: false }).exec();
  }
  return qrGroup;
};

const getStatsFromDatabase = async () => {
  const stats = await StatsModel.findOne();
  // Created first becase created is first on the webpage and destructured elsewhere with QR, Scans
  return [stats?.created, stats?.scans];
};

const adminDeleteAllQRs = async () => {
  try {
    const allDeleted = await QRModel.deleteMany();
    const deletedStats = await StatsModel.findOneAndUpdate(
      {},
      { scans: 0, created: 0 }
    );
    console.log(
      "All QRs deleted:",
      allDeleted,
      "\nAll stats deleted:",
      deletedStats
    );
  } catch (error) {
    console.error("Error deleting all documents");
  }
};

const adminCreateStats = async () => {
  try {
    const stats = await StatsModel.create({ scans: 0, created: 0 });
    console.log("Successfully created empty stats", stats);
  } catch (error) {
    console.error("Error creating base stats", error);
  }
};

//! DO NOT ALLOW QR CODES FROM THESE SITES OR WORDS
const badURLS = [
  "hentai",
  "sex",
  "porn",
  "shit",
  "dick",
  "pussy",
  "cunt",
  "bitch",
  "fuck",
  "slut",
  "sexy",
  "whore",
  "lewd",
  "nsfw",
  "pornhub.com",
  "kink.com",
  "youjizz.com",
  "8tube.com",
  "redtube.com",
  "Match.com",
  "MeetMe.com",
  "OKCupid.com",
  "Tinder.com",
  "Bumble.com",
  "Chaturbate.com",
  "Bongacams.com",
  "MyFreeCams.com",
  "LiveJasmin.com",
  "SlutRoulette.com",
  "Nutaku",
  "HentaiHeroes",
  "CuntWars",
  "PornstarHarem",
  "LifeSelector",
  "KingOfKinks",
  "ProjectQT",
  "3DSexVilla2",
  "BootyCalls",
  "KamihimeProjectR",
  "3DXChat",
  "PocketWaifu",
  "FapTitans",
  "TownOfSins",
  "BootyHeroes",
  "DirtyLeague",
  "EroLabs",
  "HornyVilla",
  "BoobyLegends",
  "LustGoddess",
  "SFGirls",
  "HentaiClicker",
  "ComixHarem",
  "TransPornstarHarem",
  "BigBangEmpire",
  "BootyFarm",
  "MergeNymphs",
  "GodsOfHentai",
  "GirlvaniaSummerLust",
  "SmutStone",
  "RedLightCenter",
  "Utherverse",
  "SexSelector",
  "InteractivePOV",
  "DLsiteGames",
  "JastUSA",
  "CravingQuest",
  "FAPCeo",
  "BoobsInTheCity",
  "AttackOnMoeH",
  "FakeLay",
  "VixenWars",
  "HeavyMetalBabes",
  "Crush rush",
  "SinVR",
  "HotCandyLand",
  "MNFClubGame",
  "MeetAndFuckGames",
  "Yareel",
  "LessonOfPassion",
  "OverWatchPornGame",
  "AngryBangers",
  "Erogames",
  "PornhubCasino",
  "Omegle.com",
  "TalkWithStranger.com",
  "ChatRoulette.com",
  "Chat-Avenue.com",
  "PalTalk.com",
  "BetOnline.ag",
  "FreeSpin.com",
  "Bovada.lv",
  "SlotoCash.im",
  "RoyalAceCasino.com",
  "PornHub",
  "XVideos",
  "xHamster",
  "XNXX",
  "Eporner",
  "HQporner",
  "Beeg",
  "YourPorn",
  "SpankBang",
  "PornTrex",
  "XMoviesForYou",
  "PornGo",
  "YouJizz",
  "Motherless",
  "RedTube",
  "YouPorn",
  "PornOne",
  "4Tube",
  "PornTube",
  "3Movs",
  "Tube8",
  "PornDig",
  "CumLouder",
  "TXXX",
  "PornDoe",
  "PornHat",
  "OK.xxx",
  "Porn00",
  "PornHoarder",
  "PornHits",
  "Bellesa",
  "PornHD3x",
  "XXXFiles",
  "PornKTube",
  "TNAFlix",
  "PornDish",
  "FullPorner",
  "Porn4Days",
  "WhoresHub",
  "ParadiseHill",
  "TrendyPorn",
  "PornHD8k",
  "XFreeHD",
  "PerfectGirls",
  "YourDailyPornVideos",
  "Porn300",
  "AnySex",
  "EroMe",
  "VXXX",
  "VePorn",
  "DrTuber",
  "NetFapX",
  "LetsJerk",
  "PornoBae",
  "PornMZ",
  "XMegaDrive",
  "Brazzers3x",
  "Pornky",
  "HitPrn",
  "CzechVideo",
  "JoysPorn",
  "WatchXXXFree",
  "HDPorn92",
  "YesPornPleaseXXX",
  "RedditTube",
  "FUXNXX",
  "4kPorn",
  "WatchPorn",
  "POVAddict",
  "LatestPornVideo",
  "InPorn",
  "FreeoMovie",
  "PornTop",
  "PornXP",
  "NetFapX.net",
  "LatestLeaks",
  "AnyPorn",
  "ClipHunter",
  "SeverePorn",
  "BananaMovies",
  "CollectionOfBestPorn",
  "XTapes",
  "XkeezMovies",
  "SexTVx",
  "PornoVideosHub",
  "PandaMovies",
  "FullXXXMovies",
  "IcePornCasting",
  "PussySpace",
  "PornVibe",
  "Siska",
  "XXXScenes",
  "MegaTube",
  "FAkingsTV",
  "JustFullPorn",
  "XXVideoss",
  "ThePornArea",
  "Analdin",
  "XoZilla",
  "EmpFlix",
  "EroticMV",
  "Perverzija",
  "PornX",
  "StreamPorn",
  "SwingerPornFun",
  "ThePornFull",
  "PornFeat",
  "PornVideoBB",
  "MangoPorn",
  "GimmePorn",
  "WhereIsMyPorn",
  "PornoFlix",
  "TubeOrigin",
  "NePorn",
  "PornEZ.cam",
  "EuroXXX",
  "Americass",
  "SexTu",
  "YesPornVip",
  "GalaxyPorn",
  "Taxi69",
  "Fux.com",
  "Sexu",
  "DefineBabe",
  "HutPorner",
  "PornSeed",
  "TitFap",
  "xCum",
  "Upornia",
  "XCafe",
  "HDZog",
  "XXXTube",
  "PornLib",
  "ABXXX",
  "Bingato",
  "LetMeJerk",
  "Xfuntaxy",
  "XXXSeed",
  "FreeOnes Tube",
  "HD-EasyPorn",
  "Brazz",
  "Porn2All",
  "Big Butts Hub",
  "XXAM",
  "CheemsPorno",
  "PHUB",
  "Fapnado",
  "inXXX",
  "UsersPorn",
  "FYPTT",
  "TikPorn",
  "xfree.com",
  "Kwiky",
  "XXXTik",
  "XXX Follow",
  "Sharesome",
  "OGFAP",
  "OnlyTik",
  "PinPorn",
  "MyClub",
  "Slushy",
  "Fantasi",
  "Pikped",
  "TikpornTube",
  "TikTok.pm",
  "FiqFuq",
  "AVrebo",
  "HotPic.cc",
  "NSFWSwipe",
  "Fap Bar",
  "TitFap",
  "Waptap",
  "ExtraNaughty",
  "SwipeFap",
  "JavTrailers",
  "Rule34",
  "KemonoParty",
  "E-Hentai",
  "E621",
  "FurAffinity",
  "Gelbooru",
  "Rule34Paheal",
  "SankakuChannel",
  "ExHentai",
  "Danbooru",
  "LusciousHentai",
  "HentaiFoundry",
  "SankakuComplex",
  "Rule34Hentai",
  "Rule34.xyz",
  "R-34.xyz",
  "Rule34.us",
  "HypnoHub",
  "LoLHentai",
  "Derpibooru",
  "Pixiv",
  "FapService",
  "TheHentaiWorld",
  "Xbooru",
  "StudioFOW",
  "GiantessBooru",
  "FootFetishBooru",
  "HentaiFromHell",
  "WHentai",
  "FapForFun",
  "DeviantArt",
  "InkBunny",
  "Rule34.dev",
  "Nozomi.la",
  "Yandere",
  "U18Chan",
  "999Hentai",
  "Bleachbooru",
  "FurryBooru",
  "Scatbooru",
  "PregChan",
  "Rule34App",
  "Kusowanka",
  "Hanime.tv",
  "HentaiHaven",
  "Rule34Video",
  "AnimeIDHentai",
  "Hentai.tv",
  "HentaiCity",
  "MuchoHentai",
  "HentaiMama",
  "Ohentai",
  "HentaiWorld.tv",
  "Hentaigasm",
  "HentaiStream",
  "UncensoredHentai",
  "HentaiPlay",
  "PornHubHentai",
  "XVideosHentai",
  "UnderHentai",
  "XAnimePorn",
  "HentaiSea",
  "HentaiTube.online",
  "HentaiMoon",
  "MioHentai",
  "HentaisTube",
  "WatchHentai",
  "HentaiFreak",
  "HentaiPRN",
  "TheJOIDatabase",
  "HentaiX",
  "HentaiCloud",
  "HentaiYes",
  "HentaiFox.tv",
  "AniPorn",
  "ZhenTube",
  "HentaVerse",
  "HentaiDNA",
  "ManyToon",
  "ManhwaHentai",
  "MangaHentai.me",
  "Manhwax",
  "Manhwa68",
  "Hentai Webtoon",
  "Manhwa18.org",
  "FreeComicOnline.me",
  "TabooFlix",
  "MotherlessTaboo",
  "MilfNut",
  "FamilyPorn",
  "TabooTube",
  "Milfzr",
  "TabooPorn.tv",
  "TabooHome",
  "TabooDaddy",
  "TabooVidz",
  "FamilyPornHD",
  "JustTabooPorn",
  "XVideosTaboo",
  "SxyPrnTaboo",
  "MotherSonTube",
  "iXXXTaboo",
  "TabooDude",
  "TabooPorn.to",
  "MILFCaps",
  "FamilyPorner",
  "PornPicsTaboo",
  "ScrolllerTaboo",
  "ImageFapTaboo",
  "Incezt",
  "Literotica",
  "nHentai",
  "HentaiFox",
  "Hentai2Read",
  "Hitomi.la",
  "IMHentai",
  "HentaiEra",
  "HentaiRead",
  "Simply Hentai",
  "Pururin",
  "HentaiRox",
  "9Hentai",
  "AsmHentai",
  "MultPorn",
  "HentaiH",
  "nHentai.com",
  "nHentai.xxx",
  "HentaiEnvy",
  "M-Hentai",
  "HentaiHand",
  "HentaiZap",
  "EAHentai",
  "Brazzers",
  "BangBros",
  "Reality Kings",
  "SpiceVids",
  "I Know That Girl",
  "AdultTime",
  "PureTaboo",
  "GirlfriendGPT",
  "TeamSkeet",
  "MYLF",
  "FapHouse",
  "NaughtyAmerica",
  "XVideosRed",
  "Mofos",
  "EvilAngel",
  "Vixen",
  "AdultPrime",
  "PornBox",
  "BellesaPlus",
  "FamilyStrokes",
  "Swappz",
  "LetsDoeIt",
  "Porn+",
  "VixenPlus",
  "NubilesPorn",
  "Babes",
  "DigitalPlayground",
  "AdultMobile",
  "JulesJordan",
  "Blacked",
  "FantasyGF",
  "SisLovesMe",
  "Milfed",
  "NubileFilms",
  "Dogfart Network",
  "Clips4Sale",
  "FakeHub",
  "Tiny4K",
  "Passion HD",
  "VideoBox",
  "New Sensations",
  "ScoreLand",
  "Private.com",
  "CherryPimps",
  "LilHumpers",
  "ThunderCock",
  "Tonights Girlfriend",
  "HardX",
  "Bang.com",
  "Deeper.com",
  "21Naturals",
  "DevilsFilm",
  "Club Seventeen",
  "21Sextury",
  "PornWorld",
  "PentHouseGold",
  "Nympho.com",
  "Spizoo",
  "DorcelClub",
  "Nookies",
  "Hussie Pass",
  "FilthFlix",
  "PropertySex",
  "FuckingAwesome",
  "PornPros",
  "LoveHerFilms",
  "PornCZ",
  "JacquieEtMichelTV",
  "HookupHotshot",
  "TeensLoveHugeCocks",
  "SenSex",
  "LittleCapriceDreams",
  "AOFLIX",
  "MagmaFilm",
  "EnjoyX",
];

module.exports = {
  saveQRToDatabase,
  adminDeleteAllQRs,
  badURLS,
  adminCreateStats,
  detectDuplicateQR,
  checkForBadURLS,
  getAllQRsFromDatabase,
  getGroupFromDatabase,
  getStatsFromDatabase,
  updateQRsInDatabase,
  updateScansInDatabase,
  updateQRCount,
};

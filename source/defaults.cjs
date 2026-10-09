var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// source/defaults.ts
var defaults_exports = {};
__export(defaults_exports, {
  defaultSettings: () => defaultSettings
});
module.exports = __toCommonJS(defaults_exports);
var defaultSettings = {
  Amazon: {
    skipIntro: true,
    skipCredits: true,
    watchCredits: false,
    selfAd: true,
    skipAd: true,
    speedSlider: true,
    filterPaid: false,
    showRating: true,
    xray: true,
    improveUI: true,
    hideTitles: true
  },
  Netflix: {
    skipIntro: true,
    skipRecap: true,
    skipCredits: true,
    watchCredits: false,
    skipBlocked: true,
    skipAd: true,
    speedSlider: true,
    profile: true,
    showRating: true,
    removeGames: true,
    hideTitles: true
  },
  Disney: {
    skipIntro: true,
    skipCredits: true,
    watchCredits: false,
    skipAd: true,
    speedSlider: true,
    showRating: true,
    hideTitles: true
  },
  Crunchyroll: {
    skipIntro: true,
    skipCredits: true,
    skipAfterCredits: false,
    speedSlider: true,
    releaseCalendar: true,
    profile: true,
    bigPlayer: true,
    filterQueued: true,
    dubLanguage: "none",
    filterDuplicates: true,
    showRating: true
  },
  HBO: {
    skipIntro: true,
    skipCredits: true,
    watchCredits: false,
    speedSlider: true,
    showRating: true
  },
  Paramount: {
    skipIntro: true,
    skipCredits: true,
    watchCredits: false,
    speedSlider: true,
    showRating: true,
    skipAd: true
  },
  Video: {
    playOnFullScreen: true,
    epilepsy: false,
    userAgent: true,
    doubleClick: true,
    scrollVolume: true,
    showYear: false,
    dimLowRatings: false
  },
  Statistics: {
    AmazonAdTimeSkipped: 0,
    NetflixAdTimeSkipped: 0,
    DisneyAdTimeSkipped: 0,
    ParamountAdTimeSkipped: 0,
    IntroTimeSkipped: 0,
    RecapTimeSkipped: 0,
    SegmentsSkipped: 0
  },
  General: {
    Crunchyroll_profilePicture: "",
    profileName: "",
    profilePicture: "",
    sliderSteps: 1,
    sliderMin: 5,
    sliderMax: 20,
    GCdate: "2024-01-01",
    MALGCdate: "2024-01-01",
    Crunchyroll_skipTimeout: 0,
    RatingThresholds: [
      { color: "red" /* Red */, value: 5.5 },
      { color: "rgb(245, 197, 24)" /* Yellow */, value: 7 },
      { color: "rgb(0, 166, 0)" /* Green */, value: 10 }
    ]
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultSettings
});

import MMJournalSheet from "./apps/journal-sheet-mm.mjs";

/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

Hooks.once("init", () => {

  // Creating MM config object
  CONFIG.MM = {};

  // Register Journal Sheet
  foundry.applications.apps.DocumentSheetConfig.registerSheet(JournalEntry, "monster-manual", MMJournalSheet, {
    types: ["base"],
    label: "怪物图鉴 Monster Manual (2024)",
    makeDefault: false

  });

  // Add pull quote font (Walter Turncoat)
  Object.assign(CONFIG.fontDefinitions, {
    Turncoat: {
      editor: true,
      fonts: [{urls: ["modules/dnd5e-collection-2024/fonts/walter-turncoat/WalterTurncoat-Regular.ttf"]}],
    }
  });

});

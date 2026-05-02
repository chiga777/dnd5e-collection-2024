import "./portal.js";
import "./rarity-color.js";
import "./players-handbook.mjs";
import "./dungeon-masters-guide.mjs";
import "./monster-manual.mjs";

import { registerModuleSettings } from "./settings.mjs";

Hooks.once("init", () => {
  registerModuleSettings();
});

Hooks.once("ready", async () => {
  if (!game.user.isGM) return;
  // Handle showing changelog
  const currentVersion = game.modules.get("dnd5e-collection-2024").version;
  const lastVersion = game.settings.get("dnd5e-collection-2024", "lastVersion");

  if (foundry.utils.isNewerVersion(currentVersion, lastVersion)) {
    const journal = await fromUuid("Compendium.dnd5e-collection-2024.index.JournalEntry.LIJ2edVRwBsE8HgV");
    const page = journal.pages.contents[journal.pages.contents.length - 1];
    journal.sheet.render(true, {pageId: page.id});
    game.settings.set("dnd5e-collection-2024", "lastVersion", currentVersion)
  }
});
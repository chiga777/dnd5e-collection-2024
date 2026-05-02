const MODULE_ID = "dnd5e-collection-2024";

export function registerModuleSettings() {
  game.settings.register(MODULE_ID, "lastVersion", {
    name: "VERSION.name",
    hint: "VERSION.hint",
    scope: "world",
    config: false,
    type: String,
    default: "1.0.0"
  });

  game.settings.register(MODULE_ID, "RarityColor", {
    name: "BG3 风格的稀有度颜色",
    hint: "这将在物品卡拥有稀有度等级时，对其图片适用稀有度样式。",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  });
}

export function isRarityColorEnabled() {
  return game.settings.get(MODULE_ID, "RarityColor");
}
import { isRarityColorEnabled } from "./settings.mjs";

Hooks.on("renderItemSheet5e", (app, html) => {
  if (!isRarityColorEnabled()) return;

  const rarity = app.item?.system?.rarity || app.document?.system?.rarity;
  if (!rarity) return;

  const $html = html instanceof HTMLElement ? $(html) : $(html[0]);
  const $target = $html.find(".sheet-header .left img.item-image");
  if (!$target.length) return;

  $target.removeClass("rarity-uncommon rarity-rare rarity-veryRare rarity-legendary rarity-artifact");
  $target.addClass(`rarity-${rarity}`);
});

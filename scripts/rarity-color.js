Hooks.on("renderItemSheet5e", (app, html) => {
  const rarity = app.item?.system?.rarity || app.document?.system?.rarity;
  if (!rarity) return;

  const $html = html instanceof HTMLElement ? $(html) : $(html[0]);
  const $target = $html.find(".sheet-header .left img.item-image");
  if (!$target.length) return;

  $target.addClass(`rarity-${rarity}`);
});
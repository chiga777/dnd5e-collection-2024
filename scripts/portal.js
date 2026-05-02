// ==================================================
// Compendium Sidebar Hook
// Intercept the index compendium entry and open the portal app.
// ==================================================
Hooks.on("renderCompendiumDirectory", (app, html) => {

  const PACK_ID = "dnd5e-collection-2024.index";

  const entry = html.querySelector(`[data-pack="${PACK_ID}"]`);
  if (!entry) return;

  if (entry.dataset.customized === "true") return;
  entry.dataset.customized = "true";

  entry.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pack = game.packs.get(PACK_ID);
    if (!pack) return;

    new PortalApp(pack).render(true);
  });
});


// ==================================================
// Application Base
// ==================================================
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function openPackById(packId) {
  if (!packId) return;

  const pack = game.packs.get(packId);
  if (!pack) return;

  pack.render(true);
}


// ==================================================
// Portal App
// ==================================================
class PortalApp extends HandlebarsApplicationMixin(ApplicationV2) {

  constructor(pack, options = {}) {
    super(options);
    this.pack = pack;
  }

  static DEFAULT_OPTIONS = {
    id: "dnd5e-collection-index",
    window: {
      title: "門戶",
      resizable: true
    },
    position: {
      width: 800,
      height: 950
    },
    classes: [
      "dnd5e-collection-2024",
      "portal-app",
      "table-of-contents"
    ]
  };

  static PARTS = {
    main: {
      template: "modules/dnd5e-collection-2024/templates/portal.hbs"
    }
  };

  async _prepareContext() {

    const documents = await this.pack.getDocuments();

    const context = {
      header: null,
      chapters: [],
      bookshelf: BOOKSHELF.map(group => ({
        label: group.label,
        books: group.books.map(book => {
          const pack = game.packs.get(book.pack);

          return {
            ...book,
            label: pack?.metadata?.label ?? book.label,
            actions: (book.actions ?? [])
              .map(action => {
                const actionPack = game.packs.get(action.pack);
                if (!actionPack) return null;

                return {
                  ...action,
                  packLabel: actionPack.metadata?.label ?? action.label
                };
              })
              .filter(Boolean)
          };
        })
      }))
    };

    for (const entry of documents) {

      const flags = entry.flags?.dnd5e;
      if (!flags) continue;

      const keys = Object.keys(flags);

      if (
        flags.tocHidden ||
        !keys.length ||
        (keys.length === 1 && keys[0] === "navigation")
      ) continue;

      const type = flags.type ?? "chapter";

      if (type === "header") {

        const page = entry.pages.contents[0];

        context.header = {
          title: flags.title ?? page?.name,
          content: page?.text?.content
        };

        continue;
      }

      context.chapters.push({
        type,
        flags,
        id: entry.id,
        name: flags.title ?? entry.name,
        pages: [],
        showPages: false
      });
    }

    context.chapters.sort(
      (a, b) => (a.flags.position ?? 0) - (b.flags.position ?? 0)
    );

    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);

    const root = this.element[0] ?? this.element;

    root.querySelectorAll("[data-action='activateEntry']")
      .forEach(el => {

        el.addEventListener("click", async (event) => {

          event.preventDefault();
          event.stopPropagation();

          const target = event.currentTarget;

          const entryId = target
            .closest("[data-entry-id]")?.dataset.entryId;

          if (!entryId) return;

          const entry = await this.pack.getDocument(entryId);
          if (!entry) return;

          const pageId = target
            .closest("[data-page-id]")?.dataset.pageId;

          entry.sheet.render(true, { pageId });
        });
      });

    root.querySelectorAll("[data-action='openPack']")
      .forEach(el => {

        el.addEventListener("click", (event) => {

          event.preventDefault();
          event.stopPropagation();

          openPackById(el.dataset.pack);
        });
      });

    root.querySelectorAll(".book")
      .forEach(el => {

        el.addEventListener("click", (event) => {

          event.preventDefault();
          event.stopPropagation();

          openPackById(el.dataset.pack);
        });
      });
  }
}


// ==================================================
// Bookshelf Config
// ==================================================
const BOOKSHELF = [
  {
    label: "核心规则",
    books: [
      {
        pack: "dnd5e-collection-2024.players-handbook",
        img: "modules/dnd5e-collection-2024/assets/journal-art/players-handbook-2024-cover.webp",
        actions: [
          {
            label: "目录",
            pack: "dnd5e-collection-2024.players-handbook"
          },
          {
            label: "资源",
            pack: "dnd5e-collection-2024.phb-content"
          }
        ]
      },
      {
        pack: "dnd5e-collection-2024.dungeon-masters-guide",
        img: "modules/dnd5e-collection-2024/assets/journal-art/dungeon-masters-guide-2024-cover.webp",
        actions: [
          {
            label: "目录",
            pack: "dnd5e-collection-2024.dungeon-masters-guide"
          },
          {
            label: "资源",
            pack: "dnd5e-collection-2024.dmg-content"
          },
          {
            label: "场景",
            pack: "dnd5e-collection-2024.dmg-scenes"
          }
        ]
      },
      {
        pack: "dnd5e-collection-2024.monster-manual",
        img: "modules/dnd5e-collection-2024/assets/journal-art/monster-manual-2024-cover.webp",
        actions: [
          {
            label: "目录",
            pack: "dnd5e-collection-2024.monster-manual"
          },
          {
            label: "资源",
            pack: "dnd5e-collection-2024.mm-creatures"
          }
        ]
      }
    ]
  }
];

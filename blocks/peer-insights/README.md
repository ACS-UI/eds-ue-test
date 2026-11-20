# Peer Insights

An informational card collection based on the [Peer Insights Figma section](https://www.figma.com/design/JZlpv6erRJr8NQXTP8QStY/ExL-AIM-Hub-V2-%E2%80%93-DEV?node-id=3586-635&m=dev).

## Universal Editor

1. Add **Peer Insights** to a separate section.
2. Add one **Peer Insights Introduction** as the first child.
3. In its rich-text field, add an optional eyebrow paragraph, an **H2** heading,
   and an introductory paragraph.
4. Add **Peer Insight Card** children in reading order. Each has an optional
   image, image alternative text, and rich-text content: an **H3** title,
   a description paragraph, and an optional **bold** byline paragraph.
5. Reorder, add, or remove cards using the content tree. The Figma example has
   six cards, but the block does not require a fixed count.

| Peer Insights |
| --- |
| Eyebrow paragraph, H2 heading, introductory paragraph |
| Image | H3 title, description paragraph, bold byline paragraph |
| Image | H3 title, description paragraph, bold byline paragraph |

The introduction is a single-cell row. Cards have image and content cells;
a single-cell card containing an H3 is also supported. Image-free cards use
the full width. The decorator preserves authored elements and editor attributes.

## Design decisions

- Uses the site's existing body and heading fonts, as approved, rather than
  distributing Adobe Clean fonts. Typography and line wrapping differ from Figma.
- Cards are informational, without buttons or invented destination links.
  Descriptions remain fully readable rather than being clamped without a way
  to read the remainder.
- The pastel background is a block-scoped approximation of the surrounding
  Figma page background; it applies only to this block's containing section.
- Mobile cards stack their image and text. From 600px they are horizontal.
  From 1200px the collection has two columns. Maximum content width is 1280px.
- The five exported 226x170 PNG crops are local test fixtures, not production
  media. Upload approved, higher-resolution source images to AEM Assets and
  select them in the editor for real authored content.

## Validation

Run from the repository root:

```sh
npm run build:json
npm run lint
node --test test/blocks/peer-insights/peer-insights.test.mjs test/blocks/callout/callout.test.mjs
aem up --port 3011 --no-stop-other --no-open --no-livereload --url https://main--eds-ue-test--acs-ui.aem.page/
```

Open `http://localhost:3011/test/blocks/peer-insights/index.html`. The fixture
covers the six design cards, omitted optional content, long unbroken text,
single-cell cards, and an empty block. Check 320, 375, 768, 1024, 1200,
and 1440px viewports. Test fixtures are excluded from delivered code by
`.hlxignore`; CMS preview and Universal Editor insertion/editing need a real
authored page after the configuration is available.

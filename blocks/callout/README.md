# Callout

A highlighted panel for supplementary information. It uses the site's existing
colors and typography and has a non-interrupting `note` role.

## Authoring

After deploying the block code and generated component configuration:

1. Open a page in Universal Editor.
2. Select a section and add **Callout**.
3. Edit its **Content** rich-text field. Use an optional heading, paragraphs,
   lists, and descriptive links. Choose a heading level that fits the page.
4. Preview the page before publishing.

The content model is one row with one rich-text cell. A heading is optional;
empty content does not cause a rendering error. Decoration preserves the
authored elements and Universal Editor attributes.

The source definition and model are in `_callout.json`; section registration is
in `models/_section.json`. Run `npm run build:json` after changing these sources
and include the generated root component JSON files.

## Local validation

```sh
npm ci
npm run build:json
npm run lint
node --test test/blocks/callout/callout.test.mjs
aem up --port 3011 --no-stop-other --no-open --no-livereload \
  --url https://main--eds-ue-test--acs-ui.aem.page/
```

Open `http://localhost:3011/test/blocks/callout/index.html`. The fixture covers
rich content, a message without a heading, long text, author instrumentation,
and an empty cell. Test files are excluded from delivery by `.hlxignore`.

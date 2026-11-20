import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import decorate from '../../../blocks/peer-insights/peer-insights.js';

const readJSON = async (path) => JSON.parse(
  await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'),
);

function element(children = [], matches = false) {
  const classes = new Set();
  const attributes = new Map();
  return {
    children,
    classes,
    attributes,
    classList: { add: (value) => classes.add(value) },
    querySelector: () => (matches ? {} : null),
    setAttribute: (name, value) => attributes.set(name, value),
  };
}

test('decorates an introduction and image card without replacing authored nodes', () => {
  const introduction = element([element()]);
  const image = element([], true);
  const body = element();
  body.attributes.set('data-aue-prop', 'text');
  const card = element([image, body], true);
  const block = element([introduction, card]);
  decorate(block);
  decorate(block);
  assert.ok(introduction.classes.has('peer-insights-introduction'));
  assert.ok(card.classes.has('peer-insights-card'));
  assert.ok(image.classes.has('peer-insights-card-image'));
  assert.ok(body.classes.has('peer-insights-card-body'));
  assert.equal(card.attributes.get('role'), 'article');
  assert.equal(block.children[1], card);
  assert.equal(card.children[1], body);
  assert.equal(body.attributes.get('data-aue-prop'), 'text');
});

test('supports empty blocks and image-free cards', () => {
  decorate(element());
  const body = element();
  const card = element([element(), body]);
  decorate(element([card]));
  assert.ok(card.classes.has('peer-insights-card-text-only'));
  assert.ok(body.classes.has('peer-insights-card-body'));
});

test('generated configuration consistently registers the container and both item types', async () => {
  const definition = await readJSON('component-definition.json');
  const models = await readJSON('component-models.json');
  const filters = await readJSON('component-filters.json');
  const distributed = await readJSON('blocks/peer-insights/_peer-insights.json');
  const ids = distributed.definitions.map((item) => item.id);
  assert.deepEqual(
    definition.groups.flatMap((group) => group.components).filter((item) => ids.includes(item.id)),
    distributed.definitions,
  );
  assert.deepEqual(models.filter((model) => ids.includes(model.id)), distributed.models);
  assert.deepEqual(filters.filter((filter) => filter.id === 'peer-insights'), distributed.filters);
  assert.equal(filters.find((filter) => filter.id === 'section').components
    .filter((id) => id === 'peer-insights').length, 1);
  const [container, ...items] = distributed.definitions;
  assert.equal(container.plugins.xwalk.page.template.filter, 'peer-insights');
  items.forEach((item) => {
    assert.ok(distributed.models.some((model) => model.id === item.plugins.xwalk.page.template.model));
    assert.ok(distributed.filters[0].components.includes(item.id));
  });
});

test('design fixture includes six cards, accessible exported images, and no fake links', async () => {
  const html = await readFile(new URL('./peer-insights.plain.html', import.meta.url), 'utf8');
  assert.equal((html.match(/data-aue-model="peer-insights-card"/g) || []).length, 6);
  assert.equal((html.match(/<img /g) || []).length, 6);
  assert.doesNotMatch(html, /<a\b/);
  const images = [...html.matchAll(/src="\.\/images\/([^"]+)"/g)].map((match) => match[1]);
  for (const image of new Set(images)) {
    const png = await readFile(new URL(`./images/${image}`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 226);
    assert.equal(png.readUInt32BE(20), 170);
  }
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import decorate from '../../../blocks/callout/callout.js';

const readJSON = async (path) => JSON.parse(
  await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'),
);

test('decoration adds note semantics without replacing authored content', () => {
  const attributes = new Map();
  const content = { text: 'Helpful information', 'data-aue-prop': 'text' };
  const block = {
    children: [content],
    setAttribute: (name, value) => attributes.set(name, value),
  };
  decorate(block);
  assert.equal(attributes.get('role'), 'note');
  assert.equal(block.children[0], content);
});

test('empty blocks can be decorated repeatedly', () => {
  const attributes = new Map();
  const block = {
    children: [],
    setAttribute: (name, value) => attributes.set(name, value),
  };
  decorate(block);
  decorate(block);
  assert.equal(attributes.get('role'), 'note');
  assert.deepEqual(block.children, []);
});

test('generated authoring configuration registers Callout consistently', async () => {
  const definition = await readJSON('component-definition.json');
  const models = await readJSON('component-models.json');
  const filters = await readJSON('component-filters.json');
  const distributed = await readJSON('blocks/callout/_callout.json');
  const definitions = definition.groups.flatMap((group) => group.components)
    .filter((component) => component.id === 'callout');
  assert.deepEqual(definitions, distributed.definitions);
  assert.deepEqual(models.filter((model) => model.id === 'callout'), distributed.models);
  assert.equal(definitions[0].plugins.xwalk.page.template.model, 'callout');
  assert.equal(filters.find((filter) => filter.id === 'section').components
    .filter((id) => id === 'callout').length, 1);
});

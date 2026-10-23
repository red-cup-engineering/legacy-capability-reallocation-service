import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, rmSync, chmodSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {inventoryTrackedLegacyCapabilities, retireTrackedLegacyCapabilities} from '../src/legacy-capability-reallocation.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'legacy-retirement-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], {stdio: ['ignore', 'pipe', 'pipe']}).toString().trim();
  git('init'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
  mkdirSync(join(root, 'lib/legacy/snapshot'), {recursive: true}); mkdirSync(join(root, 'living'));
  writeFileSync(join(root, 'living/tool.mjs'), 'export const capability = true;\n');
  for (const name of ['tool.mts', 'proof.lean', 'unique.md', 'é\nname.mjs', 'edited.mjs']) writeFileSync(join(root, 'lib/legacy/snapshot', name), name + '\n');
  symlinkSync('../../living/tool.mjs', join(root, 'lib/legacy/link'));
  git('add', '.'); git('commit', '-m', 'source');
  const revision = git('rev-parse', 'HEAD');
  const plan = {kind: 'legacy-capability-retirement-plan/v1', repositoryRoot: root, legacyRoot: 'lib/legacy', revision, capabilities: [
    {id: 'tools', disposition: 'covered', reason: 'living replacement independently reviewed', sourcePaths: ['snapshot/tool.mts', 'snapshot/é\nname.mjs', 'snapshot/edited.mjs'], evidence: [{path: 'living/tool.mjs'}]},
    {id: 'lean', disposition: 'deprecated', reason: 'deprecated proof system', authorization: 'explicit Leader instruction', sourcePaths: ['snapshot/proof.lean']}
  ]};
  return {root, git, plan};
}

test('native Git paths, light inventory, preview and selective retirement preserve edits, unknowns and untracked data', t => {
  const {root, plan} = fixture(t);
  const inventory = inventoryTrackedLegacyCapabilities(plan);
  assert.equal(inventory.entries.length, 6);
  assert(inventory.entries.some(x => x.path === 'snapshot/é\nname.mjs'));
  writeFileSync(join(root, 'lib/legacy/snapshot/edited.mjs'), 'local edit');
  writeFileSync(join(root, 'lib/legacy/snapshot/untracked.md'), 'unique');
  const preview = retireTrackedLegacyCapabilities({plan});
  assert.deepEqual(preview.counts, {eligible: 3, held: 1});
  assert(existsSync(join(root, 'lib/legacy/snapshot/tool.mts')));
  const applied = retireTrackedLegacyCapabilities({plan, apply: true});
  assert.deepEqual(applied.counts, {removed: 3, held: 1});
  for (const name of ['unique.md', 'untracked.md', 'edited.mjs']) assert(existsSync(join(root, 'lib/legacy/snapshot', name)));
  assert.equal(readFileSync(join(root, 'lib/legacy/snapshot/edited.mjs'), 'utf8'), 'local edit');
  assert.deepEqual(retireTrackedLegacyCapabilities({plan, apply: true}).counts, {absent: 3, held: 1});
});

test('declarations reject unknown and duplicate source before any deletion', t => {
  const {root, plan} = fixture(t);
  plan.capabilities[1].sourcePaths.push('snapshot/unknown.mjs');
  assert.throws(() => retireTrackedLegacyCapabilities({plan, apply: true}), /unknown/);
  assert(existsSync(join(root, 'lib/legacy/snapshot/tool.mts')));
  plan.capabilities[1].sourcePaths = ['snapshot/tool.mts'];
  assert.throws(() => retireTrackedLegacyCapabilities({plan, apply: true}), /repeated/);
});

test('missing/revised evidence and staged source changes hold their capability without losing other work', t => {
  const {root, git, plan} = fixture(t);
  writeFileSync(join(root, 'lib/legacy/snapshot/tool.mts'), 'staged change'); git('add', 'lib/legacy/snapshot/tool.mts');
  assert.match(retireTrackedLegacyCapabilities({plan}).outcomes[0].reason, /index differs/);
  plan.capabilities[0].evidence[0].sha256 = '0'.repeat(64);
  assert.deepEqual(retireTrackedLegacyCapabilities({plan, apply: true}).counts, {held: 3, removed: 1});
  assert(existsSync(join(root, 'lib/legacy/snapshot/tool.mts')));
});

test('symlink ancestor cannot redirect removal into living code', t => {
  const {root, plan} = fixture(t);
  rmSync(join(root, 'lib/legacy/snapshot'), {recursive: true});
  symlinkSync('../../living', join(root, 'lib/legacy/snapshot'));
  writeFileSync(join(root, 'living/tool.mts'), 'tool.mts\n');
  assert.deepEqual(retireTrackedLegacyCapabilities({plan, apply: true}).counts, {held: 4});
  assert(existsSync(join(root, 'living/tool.mts')));
});

test('root enumeration, mutable revisions and legacy evidence refuse', t => {
  const {plan} = fixture(t);
  assert.throws(() => inventoryTrackedLegacyCapabilities({...plan, legacyRoot: '.'}), /path/);
  assert.throws(() => retireTrackedLegacyCapabilities({plan: {...plan, revision: 'HEAD'}}), /immutable/);
  plan.capabilities[0].evidence = [{path: 'lib/legacy/snapshot/unique.md'}];
  assert.deepEqual(retireTrackedLegacyCapabilities({plan}).counts, {held: 3, eligible: 1});
});

test('native owner execute bit preserves locally edited executable modes', t => {
  const {root, git, plan} = fixture(t);
  const path = join(root, 'lib/legacy/snapshot/tool.mts');
  chmodSync(path, 0o755); git('add', 'lib/legacy/snapshot/tool.mts'); git('commit', '-m', 'executable source');
  plan.revision = git('rev-parse', 'HEAD');
  chmodSync(path, 0o654);
  assert.match(git('diff', '--summary'), /100755 => 100644/);
  assert.match(retireTrackedLegacyCapabilities({plan, apply: true}).outcomes[0].reason, /mode differ/);
  assert(existsSync(path));
});

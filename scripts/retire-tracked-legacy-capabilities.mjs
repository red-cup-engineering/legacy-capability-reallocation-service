#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {retireTrackedLegacyCapabilities, commitTrackedLegacyRetirement} from '../src/tracked-legacy-retirement.mjs';

const [path, ...args] = process.argv.slice(2);
if (!path || args.some(x => x !== '--apply' && !x.startsWith('--output='))) throw new TypeError('usage: retire-tracked-legacy-capabilities PLAN.json [--apply] [--output=RESULT.json]');
const result = retireTrackedLegacyCapabilities({plan: JSON.parse(readFileSync(path, 'utf8')), apply: args.includes('--apply')});
if (result.apply) {
  try { result.landing = commitTrackedLegacyRetirement({result}); }
  catch (error) { result.landing = {state: 'uncommitted', error: error.message}; process.exitCode = 1; }
}
const output = args.find(x => x.startsWith('--output='))?.slice('--output='.length);
if (output) writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
const summary = output ? {kind: result.kind, revision: result.revision, legacyRoot: result.legacyRoot, apply: result.apply, selectedFiles: result.selectedFiles, counts: result.counts, landing: result.landing, output} : {...result, outcomes: undefined};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
if (result.counts.held || result.landing?.state === 'committed-with-recreated-files') process.exitCode = 1;

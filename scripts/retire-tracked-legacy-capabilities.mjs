#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {retireTrackedLegacyCapabilities} from '../src/tracked-legacy-retirement.mjs';

const [path, ...args] = process.argv.slice(2);
if (!path || args.some(x => x !== '--apply' && !x.startsWith('--output='))) throw new TypeError('usage: retire-tracked-legacy-capabilities PLAN.json [--apply] [--output=RESULT.json]');
const result = retireTrackedLegacyCapabilities({plan: JSON.parse(readFileSync(path, 'utf8')), apply: args.includes('--apply')});
const output = args.find(x => x.startsWith('--output='))?.slice('--output='.length);
if (output) writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
const summary = output ? {kind: result.kind, revision: result.revision, legacyRoot: result.legacyRoot, apply: result.apply, selectedFiles: result.selectedFiles, counts: result.counts, output} : {...result, outcomes: undefined};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
if (result.counts.held) process.exitCode = 1;

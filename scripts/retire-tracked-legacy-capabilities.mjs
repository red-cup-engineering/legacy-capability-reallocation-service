#!/usr/bin/env node
import {accessSync, constants, readFileSync, lstatSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {retireTrackedLegacyCapabilities, commitTrackedLegacyRetirement, publishTrackedLegacyRetirement} from '../src/tracked-legacy-retirement.mjs';

const [path, ...args] = process.argv.slice(2);
if (!path || args.some(x => !['--apply','--publish'].includes(x) && !x.startsWith('--output='))) throw new TypeError('usage: retire-tracked-legacy-capabilities PLAN.json [--apply [--publish]] [--output=RESULT.json]');
const output = args.find(x => x.startsWith('--output='))?.slice('--output='.length);
if (args.includes('--publish') && (!args.includes('--apply') || !output)) throw new TypeError('--publish requires --apply and a durable --output receipt');
const plan = JSON.parse(readFileSync(path, 'utf8'));
let prior;
// Refuse a known unusable receipt destination before unlinking or committing.
if (output) {
  accessSync(dirname(resolve(output)), constants.W_OK);
  try {
    if (!lstatSync(output).isFile()) throw new TypeError('retirement result output must be a file');
    accessSync(output, constants.W_OK);
    if (args.includes('--publish')) {
      if (lstatSync(output).size > 2 * 1024 * 1024) throw new TypeError('retirement receipt exceeds its bounded size');
      prior = JSON.parse(readFileSync(output, 'utf8'));
      if (prior.repositoryRoot !== resolve(plan.repositoryRoot) || prior.legacyRoot !== plan.legacyRoot || prior.revision !== plan.revision) throw new TypeError('retained receipt belongs to another retirement');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const result = retireTrackedLegacyCapabilities({plan, apply: args.includes('--apply')});
if (result.apply) {
  try { result.landing = commitTrackedLegacyRetirement({result}); }
  catch (error) { result.landing = {state: 'uncommitted', error: error.message}; process.exitCode = 1; }
}
if (args.includes('--publish') && ['committed','already-landed'].includes(result.landing?.state)) {
  // Preserve local custody before any external effect, then retain its result.
  writeFileSync(output, JSON.stringify({...result, ...(prior?.publication ? {publication: prior.publication} : {})}, null, 2) + '\n');
  try { result.publication = await publishTrackedLegacyRetirement({result, previousPublication: prior?.publication}); }
  catch (error) { result.publication = {ok:false, phase:'precondition', obstructions:[String(error.message).slice(0,4096)]}; }
  if (!result.publication.ok) process.exitCode = 1;
}
if (output) writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
const summary = output ? {kind: result.kind, revision: result.revision, legacyRoot: result.legacyRoot, apply: result.apply, selectedFiles: result.selectedFiles, counts: result.counts, landing: result.landing, ...(result.publication ? {publication:{ok:result.publication.ok,phase:result.publication.phase,mergeCommit:result.publication.candidate?.mergeCommit}} : {}), output} : {...result, outcomes: undefined};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
if (result.counts.held || result.landing?.state === 'committed-with-recreated-files') process.exitCode = 1;

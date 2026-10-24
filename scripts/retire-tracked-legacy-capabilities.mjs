#!/usr/bin/env node
import {accessSync, constants, readFileSync, lstatSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {retireTrackedLegacyCapabilities, commitTrackedLegacyRetirement, publishTrackedLegacyRetirement, prepareTrackedLegacyRecordPublication, publishTrackedLegacyRecords} from '../src/tracked-legacy-retirement.mjs';

const [path, ...args] = process.argv.slice(2);
if (!path || args.some(x => !['--apply','--publish'].includes(x) && !['--output=','--publish-records=','--records-output='].some(prefix => x.startsWith(prefix)))) throw new TypeError('usage: retire-tracked-legacy-capabilities PLAN.json [--apply [--publish]] [--output=RESULT.json] [--publish-records=REQUEST.json --records-output=RECEIPT.json]');
const output = args.find(x => x.startsWith('--output='))?.slice('--output='.length);
const recordsRequest = args.find(x => x.startsWith('--publish-records='))?.slice('--publish-records='.length);
const recordsOutput = args.find(x => x.startsWith('--records-output='))?.slice('--records-output='.length);
if (args.includes('--publish') && (!args.includes('--apply') || !output)) throw new TypeError('--publish requires --apply and a durable --output receipt');
if ((recordsRequest || recordsOutput) && (!recordsRequest || !recordsOutput || !args.includes('--publish'))) throw new TypeError('record publication requires --publish, --publish-records and a separate --records-output');
if (recordsRequest && [resolve(output),resolve(recordsOutput)].includes(resolve(recordsRequest))) throw new TypeError('record request and receipt destinations must be separate files');
const planBytes = readFileSync(path);
const plan = JSON.parse(planBytes.toString('utf8'));
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
let records, priorRecords;
if (recordsRequest) {
  accessSync(dirname(resolve(recordsOutput)), constants.W_OK);
  try {
    if (!lstatSync(recordsOutput).isFile() || lstatSync(recordsOutput).size > 2 * 1024 * 1024) throw new TypeError('record publication receipt must be a bounded regular file');
    accessSync(recordsOutput, constants.W_OK);
    priorRecords = JSON.parse(readFileSync(recordsOutput, 'utf8'));
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!lstatSync(recordsRequest).isFile() || lstatSync(recordsRequest).size > 2 * 1024 * 1024) throw new TypeError('record publication request must be a bounded regular file');
  records = await prepareTrackedLegacyRecordPublication({request:JSON.parse(readFileSync(recordsRequest,'utf8')), planPath:path, planBytes, resultPath:output, receiptPath:recordsOutput, previousPublication:priorRecords});
  if (records.replay && (!prior?.publication?.ok || !['committed','already-landed'].includes(prior?.landing?.state))) throw new TypeError('record publication replay requires its completed retirement result');
}
const result = records?.replay ? prior : retireTrackedLegacyCapabilities({plan, apply: args.includes('--apply')});
if (result.apply && !records?.replay) {
  try { result.landing = commitTrackedLegacyRetirement({result}); }
  catch (error) { result.landing = {state: 'uncommitted', error: error.message}; process.exitCode = 1; }
}
if (!records?.replay && args.includes('--publish') && ['committed','already-landed'].includes(result.landing?.state)) {
  // Preserve local custody before any external effect, then retain its result.
  writeFileSync(output, JSON.stringify({...result, ...(prior?.publication ? {publication: prior.publication} : {})}, null, 2) + '\n');
  try { result.publication = await publishTrackedLegacyRetirement({result, previousPublication: prior?.publication}); }
  catch (error) { result.publication = {ok:false, phase:'precondition', obstructions:[String(error.message).slice(0,4096)]}; }
  if (!result.publication.ok) process.exitCode = 1;
}
if (output && !records?.replay) writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
let recordsPublication;
if (records && result.publication?.ok) {
  recordsPublication = await publishTrackedLegacyRecords({publication:records, previousPublication:priorRecords, save:value=>writeFileSync(recordsOutput,JSON.stringify(value,null,2)+'\n')});
  if (!recordsPublication.ok) process.exitCode = 1;
}
const summary = output ? {kind: result.kind, revision: result.revision, legacyRoot: result.legacyRoot, apply: result.apply, selectedFiles: result.selectedFiles, counts: result.counts, landing: result.landing, ...(result.publication ? {publication:{ok:result.publication.ok,phase:result.publication.phase,mergeCommit:result.publication.candidate?.mergeCommit}} : {}), ...(recordsPublication ? {recordsPublication:{ok:recordsPublication.ok,phase:recordsPublication.phase,mergeCommit:recordsPublication.candidate?.mergeCommit,output:recordsOutput}} : {}), output} : {...result, outcomes: undefined};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
if (result.counts.held || result.landing?.state === 'committed-with-recreated-files') process.exitCode = 1;

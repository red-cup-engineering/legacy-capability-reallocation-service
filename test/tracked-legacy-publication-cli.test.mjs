import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, chmodSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const cli = fileURLToPath(new URL('../scripts/retire-tracked-legacy-capabilities.mjs', import.meta.url));
const computer = fileURLToPath(new URL('../../../../../../../', import.meta.url));
const fabrication = path.join(computer, 'services/computer-systems-engineering-services-section/services/computer-code-development-system-services-section/apps/computer-code-development-engine');
const resolver = path.join(computer, 'services/computer-code-engineering-services-section/services/javascript-engineering-services-section/services/javascript-node-services-section/scripts/register-house-resolver.mjs');

// The service is the consumer under test. All source effects use native local
// Git and Fabrication's existing provider fixtures through its public export.
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'legacy-publication-cli-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const repository = path.join(root, 'work'), remote = path.join(root, 'source.git');
  const raw = (cwd, args) => String(execFileSync('git', args, {cwd, encoding:'utf8', stdio:['ignore','pipe','pipe']})).trim();
  const git = (...args) => raw(repository, args);
  raw(root, ['init', '--bare', '-q', remote]);
  raw(root, ['--git-dir', remote, 'config', 'uploadpack.allowFilter', 'true']);
  raw(root, ['init', '-q', '-b', 'main', repository]);
  git('config', 'user.name', 'Retirement consumer fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  mkdirSync(path.join(repository, 'lib/legacy/batch'), {recursive:true});
  mkdirSync(path.join(repository, 'living'));
  for (const [name, body] of Object.entries({
    'lib/legacy/batch/first.md':'old first capability\n',
    'lib/legacy/batch/second.md':'old second capability\n',
    'lib/legacy/batch/unreceived.md':'separate unreceived source\n',
    'lib/legacy/batch/held.md':'held authored information\n',
    'living/receiver.mjs':'export const received = true;\n',
    'neighbor.txt':'upstream baseline\n',
    'other-writer.txt':'original unrelated source\n'
  })) writeFileSync(path.join(repository, name), body);
  git('add', '.'); git('commit', '-qm', 'Original capability source');
  const revision = git('rev-parse', 'HEAD');
  git('remote', 'add', 'origin', remote); git('push', '-q', 'origin', 'main');
  // This already-committed absence is outside the reviewed cut. Pushing local
  // HEAD would lose it upstream, so source publication must preserve it.
  git('rm', '-q', 'lib/legacy/batch/unreceived.md');
  git('commit', '-qm', 'Separate unreceived native absence');
  const localParent = git('rev-parse', 'HEAD');
  writeFileSync(path.join(repository, 'other-writer.txt'), 'another writer staged this\n');
  git('add', 'other-writer.txt');
  const staged = git('diff', '--cached', '--raw', '-z');
  const plan = {kind:'legacy-capability-retirement-plan/v1', repositoryRoot:repository, legacyRoot:'lib/legacy', revision,
    capabilities:[{id:'reviewed-two', disposition:'covered', reason:'Actual ordinary receiving implementation independently reviewed',
      sourcePaths:['batch/first.md','batch/second.md'], evidence:[{path:'living/receiver.mjs'}]}]};
  const planPath = path.join(root, 'plan.json'), output = path.join(root, 'result.json');
  writeFileSync(planPath, JSON.stringify(plan));
  const bin = path.join(root, 'bin'); mkdirSync(bin);
  copyFileSync(path.join(fabrication, 'test/fixtures/source-candidate-git-port.sh'), path.join(bin, 'git'));
  chmodSync(path.join(bin, 'git'), 0o700);
  writeFileSync(path.join(bin, 'gh'), `#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
const args=process.argv.slice(2);
const output=String(execFileSync(process.execPath,[process.env.RETIREMENT_TEST_PROVIDER,...args],{encoding:'utf8'}));
if(process.env.RETIREMENT_TEST_LIE==='1'&&args[0]==='api'&&args[1]?.includes('/git/commits/')){
 const observed=JSON.parse(output);observed.tree={sha:'f'.repeat(40)};process.stdout.write(JSON.stringify(observed));
}else process.stdout.write(output);
`, {mode:0o700});
  // Keep an explicitly selected canonical Fabrication artifact. Otherwise use
  // the native maker; no counterfeit decoder or node_modules edits.
  assert.ok(process.env.HOUSE_PACKAGE_BINDINGS, 'run with qualified house supplier bindings');
  const bindings = JSON.parse(readFileSync(process.env.HOUSE_PACKAGE_BINDINGS, 'utf8'));
  const maker = JSON.parse(readFileSync(path.join(fabrication, 'package.json'), 'utf8'));
  if(!bindings.packages.some(row => row.name === maker.name))
    bindings.packages.push({name:maker.name, version:maker.version, directory:fabrication});
  const bindingPath = path.join(root, 'house-bindings.json');
  writeFileSync(bindingPath, JSON.stringify(bindings));
  git('remote', 'set-url', 'origin', 'https://github.com/fixture/source.git');
  git('config', `url.${remote}.insteadOf`, 'https://github.com/fixture/source.git');
  const reviewsPath = path.join(root, 'reviews.json');
  const env = {...process.env, PATH:`${bin}:${path.dirname(process.execPath)}:${process.env.PATH}`,
    HOUSE_PACKAGE_BINDINGS:bindingPath,
    NODE_OPTIONS:`--import ${resolver} --max-old-space-size=192`,
    RETIREMENT_TEST_PROVIDER:path.join(fabrication, 'test/fixtures/github-candidate-provider.mjs'),
    SOURCE_CANDIDATE_PROVIDER_FIXTURE:JSON.stringify({selection:{repository:'fixture/source'}, remote, reviews:reviewsPath}),
    SOURCE_CANDIDATE_FIXTURE_ORIGIN:'https://github.com/fixture/source.git', SOURCE_CANDIDATE_FIXTURE_REMOTE:remote,
    GIT_TRACE2_EVENT:path.join(root, 'git-events.jsonl')};
  const run = ({lie=false}={}) => {
    const execution = spawnSync(process.execPath, [cli, planPath, '--apply', '--publish', '--output='+output],
      {cwd:repository, env:{...env, RETIREMENT_TEST_LIE:lie?'1':'0'}, encoding:'utf8', timeout:60000, maxBuffer:2*1024*1024});
    return {...execution, result:existsSync(output)?JSON.parse(readFileSync(output,'utf8')):undefined};
  };
  const upstream = (...args) => raw(root, ['--git-dir', remote, ...args]);
  const refs = () => upstream('for-each-ref', '--format=%(refname) %(objectname)');
  const pushes = () => existsSync(env.GIT_TRACE2_EVENT) ? readFileSync(env.GIT_TRACE2_EVENT,'utf8').trim().split('\n').filter(Boolean)
    .map(row=>JSON.parse(row)).filter(row=>row.event==='start'&&row.argv?.includes('push')).length : 0;
  const reviews = () => JSON.parse(readFileSync(reviewsPath,'utf8'));
  const advance = path.join(root,'concurrent');
  raw(root,['clone','-q','--branch','main',remote,advance]);
  raw(advance,['config','user.name','Independent source writer']); raw(advance,['config','user.email','other@example.invalid']);
  writeFileSync(path.join(advance,'neighbor.txt'),'independent upstream advance\n');
  writeFileSync(path.join(advance,'upstream-only.txt'),'independent new source\n');
  raw(advance,['add','.']); raw(advance,['commit','-qm','Concurrent unselected source']); raw(advance,['push','-q','origin','main']);
  return {root, repository, git, upstream, refs, pushes, reviews, reviewsPath, run, revision, localParent, staged, output};
}

function assertLocalCut(f, result) {
  assert.equal(result.landing.state, 'committed');
  assert.equal(f.git('rev-parse','HEAD'), result.landing.commit);
  assert.equal(f.git('show','-s','--format=%P','HEAD'),f.localParent);
  assert.equal(f.git('diff-tree','--no-commit-id','--name-status','-r','HEAD'),
    'D\tlib/legacy/batch/first.md\nD\tlib/legacy/batch/second.md');
  assert.equal(f.git('diff','--cached','--raw','-z'),f.staged);
  assert.equal(readFileSync(path.join(f.repository,'other-writer.txt'),'utf8'),'another writer staged this\n');
  assert.equal(existsSync(path.join(f.repository,'lib/legacy/batch/unreceived.md')),false);
  for(const name of ['first.md','second.md']) assert.equal(existsSync(path.join(f.repository,'lib/legacy/batch',name)),false);
  assert.equal(existsSync(path.join(f.repository,'.git/shallow')),false);
}

function assertReceivedCut(f, result) {
  const publication=result.publication, candidate=publication.candidate;
  assert.equal(publication.ok,true); assert.equal(publication.phase,'landed');
  assert.equal(candidate.receiving.state,'received');
  assert.equal(candidate.receiving.allUnselectedPreserved,true);
  assert.deepEqual(candidate.receiving.entries.map(row=>row.path).sort(),['lib/legacy/batch/first.md','lib/legacy/batch/second.md']);
  assert.ok(candidate.receiving.entries.every(row=>row.after===null));
  assert.equal(f.upstream('show',`${candidate.mergeCommit}:lib/legacy/batch/unreceived.md`),'separate unreceived source');
  assert.equal(f.upstream('show',`${candidate.mergeCommit}:lib/legacy/batch/held.md`),'held authored information');
  assert.equal(f.upstream('show',`${candidate.mergeCommit}:neighbor.txt`),'independent upstream advance');
  assert.equal(f.upstream('show',`${candidate.mergeCommit}:upstream-only.txt`),'independent new source');
  assert.equal(f.upstream('show',`${candidate.mergeCommit}:other-writer.txt`),'original unrelated source');
  assert.equal(f.reviews().reviews.length,1);
}

test('retirement CLI commits and publishes only its reviewed cut through the real maker, then replays without source effects',t=>{
  const f=fixture(t), first=f.run();
  assert.equal(first.status,0,first.stderr||first.stdout);
  assert.deepEqual(first.result.counts,{removed:2});
  assertLocalCut(f,first.result); assertReceivedCut(f,first.result);
  const head=f.git('rev-parse','HEAD'), refs=f.refs(), reviews=readFileSync(f.reviewsPath), pushes=f.pushes();
  const replay=f.run(); assert.equal(replay.status,0,replay.stderr||replay.stdout);
  assert.equal(replay.result.landing.state,'already-landed');
  assert.equal(replay.result.publication.candidate.mergeCommit,first.result.publication.candidate.mergeCommit);
  assert.equal(f.git('rev-parse','HEAD'),head); assert.equal(f.refs(),refs); assert.equal(f.pushes(),pushes);
  assert.deepEqual(readFileSync(f.reviewsPath),reviews); assert.equal(f.git('diff','--cached','--raw','-z'),f.staged);
  assertReceivedCut(f,replay.result);
});

test('retirement CLI retains its completed real merge when receiving fails and honest replay completes the same receipt',t=>{
  const f=fixture(t), failed=f.run({lie:true});
  assert.equal(failed.status,1,failed.stderr||failed.stdout);
  assertLocalCut(f,failed.result);
  const publication=failed.result.publication;
  assert.equal(publication.ok,false); assert.equal(publication.phase,'receiving');
  assert.equal(publication.candidate.landed,true); assert.match(publication.candidate.mergeCommit,/^[0-9a-f]{40}$/u);
  assert.equal(publication.candidate.receiving,undefined);
  assert.equal(f.reviews().reviews[0].mergeCommit,publication.candidate.mergeCommit);
  const head=f.git('rev-parse','HEAD'), refs=f.refs(), reviews=readFileSync(f.reviewsPath), pushes=f.pushes();
  const replay=f.run(); assert.equal(replay.status,0,replay.stderr||replay.stdout);
  assert.equal(replay.result.publication.candidate.mergeCommit,publication.candidate.mergeCommit);
  assert.equal(f.git('rev-parse','HEAD'),head); assert.equal(f.refs(),refs); assert.equal(f.pushes(),pushes);
  assert.deepEqual(readFileSync(f.reviewsPath),reviews); assert.equal(f.git('diff','--cached','--raw','-z'),f.staged);
  assertReceivedCut(f,replay.result);
});

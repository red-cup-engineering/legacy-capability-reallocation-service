# Bounded committed-source retirement

Extend the existing reallocation service, preserving its allocation and
reconciliation exports. Git's native `ls-tree -rz` on an exact commit and
explicit legacy path supplies inventory. No directory enumeration or
whole-host reference search is needed for this mode. NUL-delimited output
preserves literal filenames. The existing reviewer supplies capability
judgments; filename/name matches alone never authorize deletion.

A plan uses the service's ordinary JSON carrier and lists capability groups
with exact legacy-relative source paths. Covered groups cite actual living
files; deprecated groups quote authority. All paths are confined to the
selected repository. Before unlinking, compare the selected commit's blob
and mode with the current stage-zero index and native worktree bytes/mode.
Reject symlink ancestors. Hash symlink target bytes without following them.
Derive the Git executable flag from the owner execute bit (`0o100`), as native
Git does; group or other execute permission cannot mask an owner-mode edit.
Do not recursively remove a directory, copy an archive, fetch history, or
rewrite source. Return per-path outcomes so held files do not block clean
ones. Repeated apply reports absent sources without deleting anything else.
Receiving after a deletion commit also reports absence when both index and
worktree lack the selected path. A recreated untracked file remains held;
committing retirement must not prevent processing the next capability group.

Evidence files are independently inspected by the reviewer and hashed in
the receiving result. Their existence is a source witness, not a proof of
semantic parity or live installation. The plan records those judgments and
their limitations. Source classification recognizes the estate's MTS,
Elisp, Racket, Scheme and Lean as code, rather than opaque binaries.
When writing the full result to a named output, CLI stdout contains only counts
and source identity; large per-capability witnesses stay in that result file.

The CLI's apply operation finishes by landing the exact removed/previously
absent tracked paths in Git. Recheck their original index identities and
worktree absence, then use native NUL-delimited literal pathspec input with
`git add -u` and `git commit --only`. Other staged work remains staged.
Already committed removals need no new commit; recreated files stop landing.
A commit failure leaves an explicit uncommitted result and failing exit code,
so the caller resolves it before starting another batch. The lower-level
unlink function remains available for controlled composition and tests.
If a hook or another actor recreates a selected file while committing, preserve
it and report `committed-with-recreated-files` with the actual commit and paths;
the CLI exits unsuccessfully so the caller reconciles those files before
continuing. A completed commit is never misreported as uncommitted.

The tracked-retirement CLI resolves and checks a named result parent and any
existing regular output file before invoking the unlink operation. Named
symlinks are refused without following their targets. Missing result
parents remain caller errors; the CLI does not invent a records directory.
These checks cover known destination defects, not later filesystem races.
The refusal leaves the source, index and HEAD untouched.

A witness may explicitly select another actual Git `repositoryRoot`. Resolve
its relative path only within that owner and use the same no-linked-ancestor,
regular-file, non-legacy and SHA-256 checks. Record its owner in the witness
receipt. Omitted owners retain the original same-repository behavior.

`--apply --publish --output=RESULT.json` composes the existing local retirement
and Fabrication's public source maker. Before its first deletion, source
preparation reads the original origin's advertised main commit and uses the
existing Fabrication/Git source reader to compare every selected original
mode/type/blob against that independently acquired commit. The accepted plan
revision remains the local review identity; the distinct remote revision and
origin become a retained source-preparation witness and the maker's
`reviewedSource`. A local-only immutable plan cut therefore does not have to
be fetchable from the original remote. Unknown remote state or mismatched
selected preimages refuses before local effects. Removed and previously
absent selected paths form the complete publication cut. This
service contains no GitHub publication or merge algorithm. Save the local
receipt before publication and the returned source result afterwards.
The receiving root is the plan's validated actual `repositoryRoot`, passed
explicitly as Fabrication's `packageRoot`; process cwd does not choose the
retirement or publication owner. The selected Fabrication0.4.15-dev.243
provider owns `git-objects.mjs` and its bounded immutable metadata transport.
Resolve that exact sibling from its public `git/github-candidate` selection;
do not copy its fetch/shallow/readback machinery. This is an explicitly
qualified internal supplier boundary, not a claim that the helper has a
published public export. Promoting that shared reader to a public API remains
a separate conformance concern.
Retain a failed receiving result's candidate and merge identity; on replay,
check the retained root and path set, then ask the same maker to receive that
candidate. No working-tree reinterpretation or replacement review is needed.

`--publish-records=REQUEST.json --records-output=RECEIPT.json` extends that
ordinary invocation after retirement publication succeeds. REQUEST contains
`repositoryRoot` and the existing maker request fields `paths`, `message`,
`push: true` and `reviewedSource`. Git Source Reading's canonical decoder
validates the request. Both the plan and retirement result must be selected
inside that actual Git owner; supporting records are explicit regular files.
Record paths cannot traverse links, enter legacy, or include RECEIPT.

Persist the exact selected file modes and byte identities in RECEIPT before
calling Fabrication. The result file is final before that separate publication:
its source-publication result goes only in RECEIPT. On replay, validate all
retained file identities and reuse the already completed retirement result;
continue the original maker candidate using the same shared publication path.
An unresolved record effect retains its own original candidate and leaves
the completed retirement source effect intact. No new GitHub algorithm,
source acquisition, repository census or cross-repository transaction is added.

The same CLI also accepts a `legacy-capability-retirement-batch/v1` input.
Its actual record `repositoryRoot` owns relative `plans`, `supportingRecords`
and five `outputs`: `plan`, `receiving`, `result`, `publicationRequest` and
`publicationReceipt`. `publication` supplies the existing maker's message,
optional candidate and exact reviewedSource. No field requests execution;
the existing CLI flags still select preview, apply and publication.

A pure composer validates the canonical plan declarations, common source cut
and disjoint selections. It retains exact UTF-8 plan/record text and SHA-256
in a bounded receiving snapshot, without promoting a review status. Explicitly
embedded record witnesses are rebound to that snapshot after their original
digest is checked; all other witnesses remain unchanged. The existing canonical
Git Source Reading decoder validates the complete three-record maker request.

Preparation reads only named regular files inside the actual record owner.
It validates every output and input alias before any write. The three generated
files are created exclusively, or reused only when byte-identical; result and
publication-receipt files remain owned by the existing CLI. A partial preparation
can therefore resume. Changed input or prepared bytes refuse before retirement.
No checkout, dependency graph, directory census, private dispatcher or alternate
source integration path is introduced. Pure counterexamples exercise mismatched
cuts, overlaps, authority and evidence failures; the ordinary CLI consumes the
prepared products on the actual pending legacy work.
A record-owner root alias is admitted only for retained, fully received
retirement and record publications, with all five existing output files and the
same physical Git root. Prepared bytes still pass the ordinary exact equality
checks. Fresh or incomplete custody retains the canonical-root requirement.
Completed source effects use Fabrication's existing immutable merge receiver;
uncertain effects keep its existing candidate-landing recovery. Historical
absolute addresses and receipt bytes are preserved rather than rewritten after
a workspace move.
Read-only reobservation never replaces a previously completed record receipt,
including when its provider is temporarily unavailable; its returned outcome
still reports that failure. New or uncertain effects retain durable progress
writes through the existing record-publication path.

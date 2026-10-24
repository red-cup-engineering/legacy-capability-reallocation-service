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

`--apply --publish --output=RESULT.json` composes the existing local retirement
and Fabrication's public source maker. The result's immutable original
mode/type/blob entries become the maker's `reviewedSource`; removed and
previously absent selected paths form the complete publication cut. This
service contains no GitHub publication or merge algorithm. Save the local
receipt before publication and the returned source result afterwards.
Retain a failed receiving result's candidate and merge identity; on replay,
check the retained root and path set, then ask the same maker to receive that
candidate. No working-tree reinterpretation or replacement review is needed.

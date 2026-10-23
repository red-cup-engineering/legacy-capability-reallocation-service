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

# Legacy capability retirement

The Leader's 2026-10-23 request is to revive information in
`lib/emsenn/services/561-group/lib/legacy` into living services. Review a
folder's capabilities briefly, find their living owners even when names,
package boundaries or repository mounts are malformed, and remove covered
legacy files. Lean material is explicitly deprecated. Git history supplies
recovery, not evidence of a replacement capability.

The service shall inventory an explicitly selected committed subtree without
walking the host or reading every source body. It shall retain exact Git
revision, path, object identity and executable/symlink modes. A retirement
shall name a capability, reason, exact selected source paths and either a
living implementation witness or explicit deprecation authority. Unknown
capabilities and meaningful unique information remain for integration.

Deletion shall affect only selected committed files whose index and working
bytes/modes still match that revision. Untracked files, local edits, Gitlinks
and paths reached through symlinks shall survive. Independent eligible files
shall proceed when another is held. The ordinary CLI shall support preview,
apply, and repeated receiving without recursive directory deletion.

Applying through the ordinary command shall commit that batch's exact removals
before returning. It shall preserve unrelated staged work and handle literal
Unicode, newline and glob characters in filenames. A failed commit shall be
reported as uncommitted with a failing exit status; another batch shall not
begin until that retirement is landed. Leader, 2026-10-23: "because you ddin't
commit your retirement, another agent restored it as possibly a glitch".

Acceptance: use this on the actual legacy collection; compare against the
existing body-reading inventory's work and whole-repository reference walk.
Test a covered capability, an explicitly deprecated one, Unicode/newline
paths, local edits, symlink escape, unknown paths and untracked siblings.
Keep source retirement separate from owner conformance and installed use.

The preexisting `retire-wave` v2 reconciles into mounted living owners and
does not move active code into legacy or edit workspace admission. Its assay
shall exercise that current contract: clean unique source integrates while
conflicting source, original custody and unrelated workspace files survive.

A named result destination with a missing/unwritable parent or an existing
non-file target shall be refused before source deletion or Git landing. A
caller must not discover an unusable receipt path only after the retirement
has committed. This requirement follows the actual 2026-10-24 receiving job,
whose four-file commit succeeded before its nonexistent output parent failed.

The ordinary retirement command shall optionally finish upstream source
publication in the same invocation. It shall pass only the reviewed cut to
the existing Fabrication maker, refuse stale reviewed preimages, and receive
the actual immutable merge. It shall preserve the local commit and any
completed external effect when receiving fails. Repeating the same request
and durable output shall reconcile the original publication without another
push or review. A local-only invocation remains available.

Before a new `--apply --publish` retirement removes or commits any source,
the service MUST qualify the selected original mode/type/blob preimages at an
actual advertised original remote commit. The accepted local immutable plan
cut need not itself exist at that remote. Retain both the reviewed plan cut
and the independently received remote source lease; never substitute local
HEAD for remote source identity. If remote observation, acquisition or any
selected preimage check fails, refuse before deletion or commit. Local-only
apply shall not require an origin or remote availability. A retained source
candidate or completed merge shall continue its original receiving path on
replay, without preparing a replacement candidate or push.

The same command shall optionally publish the retirement's plan, completed
result and explicitly selected supporting records through the existing maker.
The caller supplies their actual repository and the maker's reviewed-path
request; this service shall not implement another source publisher. Validate
that declaration and both receipt destinations before retiring source.
Keep the record-publication receipt outside its own publication cut, so its
merge identity never makes the published retirement result self-referential.
After a record publication retains an interrupted candidate, replay shall receive the original
candidate without rewriting the completed retirement result, recommitting
deletions or opening another review. Changed record bytes, a substituted owner
or a different path set shall stop that replay before any effects.

Batch preparation shall belong to this same command. Given explicitly reviewed
canonical plans, explicitly named supporting JSON records and exact output
custody, it shall assemble one canonical plan, an exact-input snapshot and a
complete existing-maker record request. Only plans with the same source owner,
legacy subtree and immutable revision may combine. Duplicate capability IDs,
overlapping source paths, changed evidence, absent deprecation authority and
incomplete publication preimages shall refuse preparation. Assembly adds no
capability judgment, authority, source publisher or installed-use claim.

Preserve original UTF-8 input bytes, their hashes and direct living-code
witnesses. Only explicitly snapshotted record witnesses may be replaced by
the assembled snapshot witness. Refuse output/input aliases, linked paths,
foreign output owners and changed existing prepared files before writing.
Preparation and replay must be deterministic, bounded and restartable without
overwriting another worker's data. Apply/publication continue through the
unchanged retirement and Fabrication operations, including ordinary recovery.
Completed retirement and record publications MUST remain reobservable when an
old explicit record-owner path becomes a symlink to the same physical Git root.
This recovery MUST preserve the original plan, input snapshots, result and
publication request bytes. It MUST NOT authorize a fresh retirement or source
publication through an aliased root. Completed publications MUST be received
from their exact immutable merge, without a new GitHub merge or push attempt.
A transient read-only receiving failure MUST preserve the last completed
receipt bytes and return the current observation failure separately, so the
same retained invocation remains retryable.

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

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

Acceptance: use this on the actual legacy collection; compare against the
existing body-reading inventory's work and whole-repository reference walk.
Test a covered capability, an explicitly deprecated one, Unicode/newline
paths, local edits, symlink escape, unknown paths and untracked siblings.
Keep source retirement separate from owner conformance and installed use.

The preexisting `retire-wave` v2 reconciles into mounted living owners and
does not move active code into legacy or edit workspace admission. Its assay
shall exercise that current contract: clean unique source integrates while
conflicting source, original custody and unrelated workspace files survive.

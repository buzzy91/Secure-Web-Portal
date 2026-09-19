---
name: Post-merge dependency installs
description: Why post-merge setup uses filtered workspace installs instead of installing every package.
---

Use filtered pnpm installs for the runnable dashboard and API dependency graphs during post-merge setup; do not switch the script back to an unfiltered full-workspace install while the Orval tarball remains blocked.

**Why:** Replit’s package firewall returns HTTP 403 for the pinned Orval tarball, causing otherwise valid post-merge setup to fail before reconciliation.

**How to apply:** When changing post-merge setup, keep the API-spec code-generator workspace outside the install selection unless Orval is upgraded to an allowed version and a full install is verified successfully.
---
name: Vitest browser environment
description: Compatibility guidance for jsdom-based React flow tests in this workspace.
---

The newest jsdom releases may require web platform APIs newer than the workspace Node runtime provides. Pin jsdom to a compatible major version when configuring Vitest with the jsdom environment, and polyfill browser-only methods such as `scrollIntoView` in test setup when the app uses them.

**Why:** An otherwise valid test suite can fail before loading tests when jsdom and the runtime disagree, or can fail on harmless browser APIs that jsdom intentionally omits.

**How to apply:** Check the runtime-supported jsdom major before upgrading test dependencies, and keep DOM-only polyfills in the test setup file rather than application code.
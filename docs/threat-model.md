---
title: Threat model
description: Assets, trust boundaries, attacker capabilities and mitigations in SoFinder.
---

# Threat model

## Protected assets

SoFinder protects configured storage roots, private resources, authenticated
user capabilities, upload quarantine, chunk sessions, metadata, quota state and
recycle-bin payloads. Public-resource URLs intentionally remain readable without
SoFinder authorization.

## Trust boundaries

- Browser input, names, paths, MIME declarations and reported sizes are
  untrusted.
- The host application supplies authentication, roles, actor identity and CSRF
  infrastructure.
- A configured local root and private state directories are trusted only after
  `sofinder:security:audit` succeeds.
- Custom adapters, inspectors, metadata stores and event listeners run with the
  host application's privileges and must be reviewed as trusted code.

## Required controls

- Normalize every path and reject traversal, hidden segments, control
  characters and symbolic-link escape.
- Quarantine uploads, count actual bytes, inspect content and fully decode image
  resources before atomic publication.
- Recheck authorization for every operation; UI capability values never grant
  authority.
- Protect replacements with a staged target or backup so failure preserves the
  original.
- Isolate chunk and recycle-bin state by opaque actor identifier, enforce CSRF,
  rate limits, concurrency limits and bounded recursive work.
- Force unsafe content to download, use `nosniff`, private cache controls and a
  restrictive CSP for authenticated proxy responses.

## Residual risks

Public delivery bypasses read ACL by design. The default inspector is not an
antivirus or content-disarm engine. Local lock files do not coordinate multiple
hosts. GD processing and ZIP creation remain bounded but consume CPU and disk;
deployments accepting hostile public traffic should isolate workers and apply
external request limits. Remote adapters are outside the 1.0 support promise.

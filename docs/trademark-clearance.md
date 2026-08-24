---
title: SoFinder trademark release gate
description: Project naming and trademark clearance notes for SoFinder maintainers.
---

# SoFinder trademark release gate

This is an engineering release gate, not legal advice. Before publishing a
tag, record dated searches for `SoFinder`, `SO FINDER` and confusingly similar
names in WIPO Global Brand Database, CNIPA, USPTO and EUIPO. Review Nice classes
9 and 42 first, with secondary checks of 35 and 38. Also check GitHub,
Packagist, npm and sustained commercial use in file-management or SaaS.

A live or pending similar mark, or established commercial use, in software,
file management, SaaS or online-service fields is a blocking conflict. In that
case do not rename automatically and do not publish: retain the evidence and
ask the project owner to choose a name. Unrelated appliance or machinery marks
are recorded but do not automatically block release.

## 2026-08-22 preliminary check

- The intended Composer vendor/package was not present in the Packagist vendor
  listing checked during preparation.
- Preliminary web results showed unrelated appliance uses, with no confirmed
  blocking file-manager or SaaS mark.
- Formal registry searches and a legal review remain required before public
  commercial promotion. The package name remains `sohophp/sofinder` unless the
  blocking-conflict rule is triggered.

## 2026-08-22 beta.2 engineering recheck

- Exact-name web searches scoped to WIPO, USPTO, EUIPO and CNIPA did not expose
  a live or pending class 9, 35, 38 or 42 file-management/software mark.
- USPTO serial 97045626 uses `SOFINDER` for class 7 household cleaning and
  kitchen machinery. It is recorded as an unrelated goods category rather
  than a blocking software conflict.
- `sofinder.me` was found as a social-profile link application. No evidence of
  file-management use, a matching software trademark, or likely source
  confusion with this PHP/Symfony package was identified in this check.
- `sohophp/sofinder` and `@sohophp/sofinder-ui` were absent from the public
  Packagist and npm registry endpoints immediately before release.

No blocking conflict was confirmed under the engineering gate, so the project
name is retained for the beta. This check is not a legal clearance opinion;
formal registry review remains required before broader commercial promotion.

## 2026-08-24 beta.9 engineering recheck

- Exact-name searches were repeated against the public WIPO, USPTO, EUIPO and
  CNIPA search surfaces, with classes 9 and 42 treated as the primary risk.
- The searches did not surface a new file-management or SaaS result that
  changes the beta.2 assessment. USPTO serial 97045626 remains the known
  unrelated class 7 result recorded above.
- Public web and package-registry searches did not identify a newly established
  confusingly similar file-manager package or service requiring the release to
  stop.

No blocking conflict was identified by this engineering recheck, so beta.9 may
retain the project name. Dynamic registry search interfaces can omit results
from ordinary web indexing; this record is not a legal clearance opinion and
does not replace a formal registry or counsel review before broader commercial
promotion.

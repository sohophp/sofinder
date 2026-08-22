# Security policy

Security fixes are provided for the latest tagged beta and the current `main`
branch. Please do not disclose a suspected vulnerability in a public issue.

Report vulnerabilities through GitHub private vulnerability reporting at
<https://github.com/sohophp/sofinder/security/advisories/new>. Include affected
versions, configuration, reproduction steps and impact. We aim to acknowledge
reports within five business days.

Applications remain responsible for authentication, authorization rules,
private writable runtime directories, web-server upload restrictions and
scheduled security/usage audits. Public resource URLs intentionally bypass
SoFinder read ACLs; sensitive resources must use proxy delivery and must not be
served directly by the web server.

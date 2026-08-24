---
title: Troubleshooting
description: Diagnose common SoFinder routing, authorization, upload, image, storage and deployment problems.
---

# Troubleshooting

## The browser route returns 404

Confirm that the bundle is registered and the route resource is imported:

```bash
bin/console debug:router | grep sofinder
```

The imported prefix controls the public URL. The retained `so_finder.route_prefix` compatibility setting does not replace the route import.

## The browser returns 401 or 403

- Confirm the request is handled by an authenticated Symfony firewall.
- Check the resource's `roles`, `operation_roles` and `path_acl`.
- Remember that an applicable deny rule wins over allow.
- Capabilities displayed by the frontend are informational; the server authorizes the final operation and path again.

## Uploads are rejected

Check, in order:

1. PHP/web-server body size and timeout limits.
2. Resource `max_size`, extension and MIME allowlists.
3. File-name length and destination folder depth.
4. Resource quota and filesystem free space.
5. Write access to quarantine, chunk, storage and usage directories.
6. Audit logs for active-content or decoded-image rejection.

## Images have no preview or editor

```bash
bin/console sofinder:image:capabilities
```

Install GD or Imagick with the required coder, then restart the PHP runtime. HEIC, HEIF and TIFF can be stored in a general file resource but are intentionally not browser-previewed or edited. See [image formats](/image-formats).

## Private files are reachable without authentication

`delivery_mode: public` intentionally bypasses SoFinder read authorization. Move the storage root outside the web root, remove any web-server alias, clear `public_url` and use `delivery_mode: proxy`.

## Generated links use the wrong prefix

Symfony's imported route prefix is authoritative. Correct `config/routes/so_finder.yaml`, then clear the production route and application cache.

## Quota is incorrect after an external import

```bash
bin/console sofinder:usage:recalculate
```

Do not modify managed storage outside SoFinder during the recalculation.

## S3 fails against a compatible provider

- Use HTTPS unless an explicitly trusted local MinIO network requires otherwise.
- Confirm region, endpoint and bucket independently.
- Enable path-style endpoints for MinIO; normally leave them disabled for AWS S3, R2 and B2.
- Use `region: auto` for Cloudflare R2.
- For providers without conditional Put Object, set `conditional_writes: false` only after accepting the documented concurrent-create race.
- Use the package's provider smoke test with a non-production bucket and prefix-restricted credentials.

## Collect useful diagnostics

Include versions, effective non-secret configuration, route output, the failing operation and relevant application logs. Never paste credentials, signed URLs, session identifiers or private file contents into a public issue. Report vulnerabilities through [GitHub private vulnerability reporting](https://github.com/sohophp/sofinder/security/advisories/new).

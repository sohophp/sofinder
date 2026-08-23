# Symfony integration

Register the bundle in the application kernel:

```php
yield new \SohoPHP\SoFinder\SoFinderBundle();
```

Import its explicit routes with an application-specific prefix:

```yaml
sofinder:
  resource: '@SoFinderBundle/Resources/config/routes.yaml'
  prefix: /sofinder
```

Configure storage resources. Every root is a security boundary; SoFinder does
not allow parent traversal or symbolic links.

```yaml
so_finder:
  theme:
    accent: '#276ef1'
    radius: '10px'
  trash_dir: '%kernel.project_dir%/var/sofinder/trash'
  usage_dir: '%kernel.project_dir%/var/sofinder/usage'
  trash_retention_days: 30
  trash_max_items: 1000
  trash_max_bytes: 1073741824
  ui:
    folder_tree: false # Initial UI preference; each browser can enable it in Settings.
    scale: standard    # compact, standard, large or xlarge; browser preference wins.
  maintenance:
    mode: inline       # inline, messenger, external or disabled
    min_interval_seconds: 300
    max_items_per_run: 50
  image_presets:
    content: { width: 1200, height: 1200, quality: 88 }
  resources:
    Images:
      adapter: local
      root: '%kernel.project_dir%/uploads/editor/images'
      public_url: '/uploads/editor/images'
      delivery_mode: public
      max_size: 20971520
      quota: 1073741824
      max_file_name_length: 120
      max_folder_name_length: 50
      max_folder_depth: 5
      max_image_pixels: 50000000
      max_batch_items: 100
      max_recursive_items: 10000
      max_archive_items: 1000
      max_archive_bytes: 536870912
      allowed_extensions: [avif, bmp, gif, ico, jpeg, jpg, png, webp]
      allowed_mime_types: [image/avif, image/bmp, image/gif, image/jpeg, image/png, image/vnd.microsoft.icon, image/x-bmp, image/x-icon, image/webp]
      roles: [ROLE_EDITOR]
      operation_roles:
        delete: [ROLE_FILE_ADMIN]
      path_acl:
        - { path: private, operations: ['*'], roles: [ROLE_FILE_ADMIN] }
        - { path: shared, operations: [read, list], roles: [ROLE_EDITOR] }
        - { path: shared/locked, operations: [delete], roles: [], allow: false }
```

The default Symfony authorization adapter requires
`IS_AUTHENTICATED_FULLY`. Applications needing per-resource or per-operation
ACLs may replace the `AuthorizationInterface` service alias.
An empty `roles` list keeps the authenticated-user behavior. `operation_roles`
overrides the resource roles for named operations such as `upload`, `rename`,
`copy`, `move`, `delete`, `read`, and `list`. Path rules inherit into children;
the most specific matching path wins and an applicable deny wins over allow.
Capabilities returned to the browser are informational—the server authorizes
every final path again. A zero quota means unlimited.

`delivery_mode: public` preserves direct URLs, but those requests are outside
SoFinder and cannot enforce read ACLs. For sensitive resources use `proxy`,
remove the web-server alias to the storage root, and leave `public_url` empty.
The proxy supports Range, ETag and conditional requests; only safe raster image
MIME types may be inline.

Theme colors accept only three- or six-digit hexadecimal values. Border radius
accepts `0px` through `32px`; these restrictions prevent configuration values
from becoming arbitrary CSS. See `plugins.md` for the public plugin contract.

The browser's gear menu stores image-toolbar visibility preferences in that
browser's local storage. It does not grant capabilities or change server ACLs.
Resize, crop, rotation, and preset sizes are initially hidden and can be enabled
in Settings. Copy/move destinations are selected only from folders returned
by the configured resource API; final paths are normalized and authorized
again by the server.

Name limits count Unicode characters rather than bytes. The resource root is
folder level zero, so a `max_folder_depth` of 5 allows files inside the fifth
folder level but does not allow another child folder. Copying,
moving, and renaming a folder validates its complete descendant tree, not only
the selected folder. Supported configuration ranges are 1–255 characters for
names and 1–100 folder levels.

Mutating API requests require the `X-CSRF-TOKEN` header. The browser route
injects a token into the React application. CKEditor 4 compatibility uploads
must receive the same token through `_token`; Origin and Referer are additional
checks, never replacements for CSRF validation.

## CKEditor 4

```javascript
CKEDITOR.replace("editor", {
  filebrowserBrowseUrl: "/sofinder/browser",
  filebrowserUploadUrl: "/sofinder/compat/ckeditor4/upload?type=Files&_token=" + encodeURIComponent(soFinderCsrfToken)
});
```

Schedule `sofinder:trash:cleanup` daily and run `sofinder:security:audit` during
deployment. Run `sofinder:usage:recalculate` after the first deployment and
daily to reconcile changes made outside SoFinder. Normal requests use the
locked persistent counter rather than recursively scanning a resource. Treat
critical audit findings as a release blocker.

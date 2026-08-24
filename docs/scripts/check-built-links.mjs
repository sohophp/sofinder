import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const distRoot = new URL('../.vitepress/dist', import.meta.url).pathname
const siteOrigin = 'https://sofinder.sohophp.app'
const htmlFiles = []
const errors = []

const visit = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) visit(path)
    else if (name.endsWith('.html')) htmlFiles.push(path)
  }
}

visit(distRoot)

const resolveTarget = (pathname) => {
  const normalized = decodeURI(pathname).replace(/^\//, '')
  const direct = join(distRoot, normalized)
  const candidates = extname(normalized)
    ? [direct]
    : [join(distRoot, `${normalized}.html`), join(direct, 'index.html')]
  return candidates.find(existsSync)
}

for (const sourcePath of htmlFiles) {
  if (relative(distRoot, sourcePath) === '404.html') continue
  const html = readFileSync(sourcePath, 'utf8')

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&')
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue

    let url
    try {
      url = new URL(href, `${siteOrigin}/${relative(distRoot, sourcePath).replace(/index\.html$/, '')}`)
    } catch {
      errors.push(`${relative(distRoot, sourcePath)}: invalid href ${href}`)
      continue
    }
    if (url.origin !== siteOrigin) continue

    const targetPath = url.pathname === relative(distRoot, sourcePath).replace(/\\/g, '/').replace(/index\.html$/, '')
      ? sourcePath
      : resolveTarget(url.pathname)
    if (!targetPath) {
      errors.push(`${relative(distRoot, sourcePath)}: missing target ${href}`)
      continue
    }

    if (url.hash && targetPath.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1))
      const targetHtml = targetPath === sourcePath ? html : readFileSync(targetPath, 'utf8')
      if (!targetHtml.includes(`id="${id}"`)) {
        errors.push(`${relative(distRoot, sourcePath)}: missing anchor ${href}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Built-link check failed:\n- ${[...new Set(errors)].join('\n- ')}`)
  process.exit(1)
}

console.log(`Built-link check passed: ${htmlFiles.length} HTML pages.`)

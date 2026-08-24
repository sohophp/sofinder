import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const docsRoot = new URL('..', import.meta.url).pathname
const locales = ['zh-TW', 'zh-CN']
const sourcePages = readdirSync(docsRoot)
  .filter((name) => name.endsWith('.md') && !name.includes('.zh-'))
  .sort()
const sourceRoutes = new Set(sourcePages.map((name) => name === 'index.md' ? '' : basename(name, '.md')))
const errors = []

const routeLines = readFileSync(join(docsRoot, '..', 'src', 'Resources', 'config', 'routes.yaml'), 'utf8').split('\n')
const httpRoutes = []
let routePath = ''
for (const line of routeLines) {
  const pathMatch = /^\s*path:\s*(\S+)/.exec(line)
  if (pathMatch) routePath = pathMatch[1]
  const methodMatch = /^\s*methods:\s*\[([A-Z]+)\]/.exec(line)
  if (methodMatch && (routePath.startsWith('/api/') || routePath.startsWith('/compat/'))) {
    httpRoutes.push(`${methodMatch[1]} ${routePath}`)
  }
}

for (const [prefix, apiPage] of [['', 'api-reference.md'], ['zh-TW', 'api-reference.md'], ['zh-CN', 'api-reference.md']]) {
  const content = readFileSync(join(docsRoot, prefix, apiPage), 'utf8')
  for (const route of httpRoutes) {
    if (!content.includes(`\`${route}\``) && !content.includes(`\`${route}?`)) {
      errors.push(`${prefix || 'en'}/${apiPage}: missing route ${route}`)
    }
  }
}

for (const locale of locales) {
  const localeRoot = join(docsRoot, locale)

  for (const page of sourcePages) {
    const localizedPath = join(localeRoot, page)
    if (!existsSync(localizedPath)) {
      errors.push(`${locale}: missing ${page}`)
      continue
    }

    const content = readFileSync(localizedPath, 'utf8')
    if (!content.startsWith('---\n') || !/^title:\s*\S/m.test(content)) {
      errors.push(`${locale}/${page}: missing frontmatter title`)
    }
    if (/noindex|翻譯狀態|翻译状态|尚未完成|not yet translated/i.test(content)) {
      errors.push(`${locale}/${page}: contains a translation placeholder`)
    }

    for (const match of content.matchAll(/\]\(\/([^/)#]*)(?:[)#])/g)) {
      const route = match[1]
      if (sourceRoutes.has(route)) {
        errors.push(`${locale}/${page}: root-locale link /${route || ''} must point to /${locale}/${route}`)
      }
    }
  }
}

for (const readme of ['README.zh-TW.md', 'README.zh-CN.md']) {
  if (!existsSync(join(docsRoot, '..', readme))) {
    errors.push(`missing ${readme}`)
  }
}

if (errors.length > 0) {
  console.error(`Locale completeness check failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`Locale completeness check passed: ${sourcePages.length} pages × ${locales.length} translations; ${httpRoutes.length} API routes documented.`)

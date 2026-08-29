import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const docsRoot = new URL('..', import.meta.url).pathname
const locales = ['zh-TW', 'zh-CN']
const sourcePages = readdirSync(docsRoot)
  .filter((name) => name.endsWith('.md') && !name.includes('.zh-'))
  .sort()
const sourceRoutes = new Set(sourcePages.map((name) => name === 'index.md' ? '' : basename(name, '.md')))
const errors = []
const stableSymfonyInstall = 'composer require sohophp/sofinder-symfony:^1.0'

const openApi = JSON.parse(readFileSync(join(docsRoot, 'public', 'openapi.json'), 'utf8'))
const httpRoutes = []
const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'])
for (const [routePath, pathItem] of Object.entries(openApi.paths ?? {})) {
  if (!routePath.startsWith('/api/') && !routePath.startsWith('/compat/')) continue
  for (const method of Object.keys(pathItem)) {
    if (httpMethods.has(method.toLowerCase())) httpRoutes.push(`${method.toUpperCase()} ${routePath}`)
  }
}
httpRoutes.sort()
if (httpRoutes.length === 0) errors.push('openapi.json: no documented API routes found')

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

for (const prefix of ['', ...locales]) {
  for (const page of ['index.md', 'getting-started.md']) {
    const relativePath = join(prefix, page)
    const content = readFileSync(join(docsRoot, relativePath), 'utf8')
    if (!content.includes(stableSymfonyInstall)) {
      errors.push(`${relativePath}: missing stable Symfony install command`)
    }
    if (content.includes('composer require sohophp/sofinder:^0.1@beta')) {
      errors.push(`${relativePath}: still recommends the retired beta line`)
    }
  }
}

for (const readme of ['README.md', 'README.zh-TW.md', 'README.zh-CN.md']) {
  const content = readFileSync(join(docsRoot, '..', readme), 'utf8')
  if (!content.includes(stableSymfonyInstall)) {
    errors.push(`${readme}: missing stable Symfony install command`)
  }
}

if (errors.length > 0) {
  console.error(`Locale completeness check failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`Locale completeness check passed: ${sourcePages.length} pages × ${locales.length} translations; ${httpRoutes.length} API routes documented.`)

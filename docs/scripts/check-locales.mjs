import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

const docsRoot = new URL('..', import.meta.url).pathname
const locales = ['zh-TW', 'zh-CN']
const sourcePages = readdirSync(docsRoot)
  .filter((name) => name.endsWith('.md') && !name.includes('.zh-'))
  .sort()
const sourceRoutes = new Set(sourcePages.map((name) => name === 'index.md' ? '' : basename(name, '.md')))
const errors = []

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

console.log(`Locale completeness check passed: ${sourcePages.length} pages × ${locales.length} translations.`)

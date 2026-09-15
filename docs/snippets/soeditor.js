import { createClassicEditor as createOptionalEditor } from '@soeditor/editor/cms/optional'
import '@soeditor/editor/cms/styles.css'
import { cmsRuntimePreset } from '@soeditor/presets/cms-runtime'
import { FileManagerPlugin, fileManagerServiceToken } from '@soeditor/file-manager'
import { SoFinderAdapter } from '@soeditor/adapter-sofinder'
import { openPicker } from '/sofinder/assets/sofinder-picker.js'

const editor = await createOptionalEditor(document.querySelector('#content'), {
  plugins: [...cmsRuntimePreset.plugins, FileManagerPlugin],
  toolbar: ['undo', 'redo', 'bold', 'italic', 'image-browse', 'file-link', 'cmsVideo'],
})

editor.editor.services.register(fileManagerServiceToken, new SoFinderAdapter({
  async pick({ kind, accept }) {
    try {
      const entry = await openPicker({
        baseUrl: '/sofinder/browser',
        kind: kind === 'image' ? 'image' : 'file',
        resource: kind === 'image' ? 'Images' : 'Files',
      })
      const mime = entry.mimeType?.toLowerCase() ?? ''
      if (accept?.length && !accept.some(type => type.endsWith('/*')
        ? mime.startsWith(type.slice(0, -1).toLowerCase())
        : mime === type.toLowerCase())) {
        throw new Error('The selected file does not match the requested format.')
      }
      if (entry.capabilities.embeddable === false) {
        throw new Error('The selected file cannot be embedded.')
      }
      return {
        url: entry.url,
        name: entry.name,
        ...(entry.mimeType != null ? { mimeType: entry.mimeType } : {}),
        ...(entry.assetId != null ? { assetId: entry.assetId } : {}),
        ...(entry.alt != null ? { alt: entry.alt } : {}),
        ...(entry.width != null ? { width: entry.width } : {}),
        ...(entry.height != null ? { height: entry.height } : {}),
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return null
      throw error
    }
  },
}))

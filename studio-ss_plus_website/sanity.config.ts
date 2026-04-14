import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'ss_plus_website',

  projectId: '937z4sjy',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'French'},
      ],
      schemaTypes: ['page'],
    }),
  ],

  schema: {
    types: schemaTypes.types,
  },
})

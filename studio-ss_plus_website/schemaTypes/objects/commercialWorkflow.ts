import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'commercialWorkflow',
  title: 'Commercial Workflow',
  type: 'object',
  fields: [
    defineField({name: 'sectionLabel', title: 'Section Label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineField({
          name: 'step',
          title: 'Step',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
  ],
})


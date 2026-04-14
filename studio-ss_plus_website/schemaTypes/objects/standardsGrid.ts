import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'standardsGrid',
  title: 'Standards Grid',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        defineField({
          name: 'certification',
          title: 'Certification',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'domain', title: 'Domain', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'standards',
      title: 'Standards',
      type: 'array',
      of: [
        defineField({
          name: 'standardItem',
          title: 'Standard Item',
          type: 'object',
          fields: [
            defineField({name: 'standard', title: 'Standard', type: 'string'}),
            defineField({name: 'domain', title: 'Domain', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
})


import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactFormSection',
  title: 'Contact Form Section',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text'}),
    defineField({
      name: 'subjects',
      title: 'Subjects',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})


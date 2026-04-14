import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emergencyBanner',
  title: 'Emergency Banner',
  type: 'object',
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
  ],
})


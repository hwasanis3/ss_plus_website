import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policyCTA',
  title: 'Policy CTA',
  type: 'object',
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'cta', title: 'CTA Text', type: 'string'}),
    defineField({name: 'contactEmail', title: 'Contact Email', type: 'string'}),
    defineField({name: 'contactPhone', title: 'Contact Phone', type: 'string'}),
  ],
})
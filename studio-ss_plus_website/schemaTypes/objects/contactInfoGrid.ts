import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactInfoGrid',
  title: 'Contact Info Grid',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineField({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'text'}),
            defineField({name: 'icon', title: 'Icon', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
})


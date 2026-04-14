import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productGrid',
  title: 'Product Grid',
  type: 'object',
  fields: [
    defineField({name: 'sectionLabel', title: 'Section Label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineField({
          name: 'product',
          title: 'Product',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
            defineField({name: 'category', title: 'Category', type: 'string'}),
            defineField({
              name: 'specs',
              title: 'Specs',
              type: 'array',
              of: [
                defineField({
                  name: 'spec',
                  title: 'Spec',
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'string'}),
                    defineField({name: 'value', title: 'Value', type: 'string'}),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})


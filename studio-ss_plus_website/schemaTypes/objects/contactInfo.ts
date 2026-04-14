import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactInfo',
  title: 'Contact Info',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineType({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
});
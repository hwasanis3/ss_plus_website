import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineType({
          name: 'column',
          title: 'Column',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'content', title: 'Content', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'bottomBar', title: 'Bottom Bar', type: 'string' }),
  ],
});
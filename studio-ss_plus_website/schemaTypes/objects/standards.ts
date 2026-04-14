import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'standards',
  title: 'Standards',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'note', title: 'Note', type: 'text' }),
  ],
});
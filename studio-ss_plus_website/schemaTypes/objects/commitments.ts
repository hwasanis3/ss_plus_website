import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'commitments',
  title: 'Commitments',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'list',
      title: 'List',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
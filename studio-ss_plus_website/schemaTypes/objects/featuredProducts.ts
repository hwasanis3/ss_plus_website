import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'featuredProducts',
  title: 'Featured Products',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
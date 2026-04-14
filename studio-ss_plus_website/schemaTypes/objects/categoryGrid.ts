import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'categoryGrid',
  title: 'Category Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'productCategory' }] }],
    }),
  ],
});
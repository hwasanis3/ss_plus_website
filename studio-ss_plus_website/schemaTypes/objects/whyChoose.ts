import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whyChoose',
  title: 'Why Choose',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'differentiators',
      title: 'Differentiators',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
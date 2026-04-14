import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'platformFeatures',
  title: 'Platform Features',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'feature' }] }],
    }),
  ],
});
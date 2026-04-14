import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'wavePlusHero',
  title: 'Wave Plus Hero',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
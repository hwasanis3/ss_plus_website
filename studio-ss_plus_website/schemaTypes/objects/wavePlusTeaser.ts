import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'wavePlusTeaser',
  title: 'Wave Plus Teaser',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'cta', title: 'CTA', type: 'string' }),
  ],
});
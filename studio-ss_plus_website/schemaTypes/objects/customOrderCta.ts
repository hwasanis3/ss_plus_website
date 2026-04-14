import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'customOrderCta',
  title: 'Custom Order CTA',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'cta', title: 'CTA', type: 'string' }),
  ],
});
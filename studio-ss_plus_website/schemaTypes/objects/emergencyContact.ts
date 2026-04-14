import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'emergencyContact',
  title: 'Emergency Contact',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'cta', title: 'CTA', type: 'string' }),
  ],
});
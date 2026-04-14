import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'accessAvailability',
  title: 'Access Availability',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
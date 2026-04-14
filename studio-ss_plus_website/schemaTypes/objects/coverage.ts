import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'coverage',
  title: 'Coverage',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'note', title: 'Note', type: 'text' }),
  ],
});
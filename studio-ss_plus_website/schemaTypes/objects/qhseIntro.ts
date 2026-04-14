import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'qhseIntro',
  title: 'QHSE Intro',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
});
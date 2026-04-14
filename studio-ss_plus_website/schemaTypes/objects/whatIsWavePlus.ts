import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whatIsWavePlus',
  title: 'What Is Wave Plus',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
});
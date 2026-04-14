import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'introSnippet',
  title: 'Intro Snippet',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'cta', title: 'CTA', type: 'string' }),
  ],
});
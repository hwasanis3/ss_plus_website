import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'screenshotSection',
  title: 'Screenshot Section',
  type: 'object',
  fields: [
    defineField({ name: 'note', title: 'Note', type: 'text' }),
  ],
});
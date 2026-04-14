import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'object',
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'note', title: 'Note', type: 'text' }),
  ],
});
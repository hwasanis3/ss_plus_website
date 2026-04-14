import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'mapEmbed',
  title: 'Map Embed',
  type: 'object',
  fields: [
    defineField({ name: 'note', title: 'Note', type: 'text' }),
  ],
});
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'whyWavePlus',
  title: 'Why Wave Plus',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        },
      ],
    }),
  ],
});
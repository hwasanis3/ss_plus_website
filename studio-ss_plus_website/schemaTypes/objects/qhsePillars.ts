import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'qhsePillars',
  title: 'QHSE Pillars',
  type: 'object',
  fields: [
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [
        defineType({
          name: 'pillar',
          title: 'Pillar',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        }),
      ],
    }),
  ],
});
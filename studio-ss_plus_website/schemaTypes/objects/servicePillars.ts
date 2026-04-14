import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'servicePillars',
  title: 'Service Pillars',
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
            defineField({ name: 'icon', title: 'Icon', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
            defineField({ name: 'link', title: 'Link', type: 'url' }),
          ],
        }),
      ],
    }),
  ],
});
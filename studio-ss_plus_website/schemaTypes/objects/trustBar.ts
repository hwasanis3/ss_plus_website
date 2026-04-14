import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'trustBar',
  title: 'Trust Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineType({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Number', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
});
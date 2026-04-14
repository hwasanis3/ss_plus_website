import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'coreValues',
  title: 'Core Values',
  type: 'object',
  fields: [
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
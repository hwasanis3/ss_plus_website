import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  fields: [
    defineField({
      name: 'milestones',
      title: 'Milestones',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'milestone' }] }],
    }),
  ],
});
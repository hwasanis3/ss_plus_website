import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [
        defineType({
          name: 'cta',
          title: 'CTA',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
            defineField({ name: 'primary', title: 'Primary', type: 'boolean' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'visual',
      title: 'Visual',
      type: 'image',
    }),
  ],
});
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'object',
  fields: [
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'navItems',
      title: 'Nav Items',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'string' }),
  ],
});
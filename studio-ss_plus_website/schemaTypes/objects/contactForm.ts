import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'fields',
      title: 'Fields',
      type: 'array',
      of: [
        defineType({
          name: 'field',
          title: 'Field',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'type', title: 'Type', type: 'string' }),
            defineField({ name: 'required', title: 'Required', type: 'boolean' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'submitLabel', title: 'Submit Label', type: 'string' }),
    defineField({ name: 'postSubmitMessage', title: 'Post Submit Message', type: 'text' }),
  ],
});
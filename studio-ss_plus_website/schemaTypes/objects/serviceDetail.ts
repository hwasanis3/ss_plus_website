import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'serviceDetail',
  title: 'Service Detail',
  type: 'object',
  fields: [
    defineField({ name: 'service', title: 'Service', type: 'reference', to: [{ type: 'service' }] }),
  ],
});
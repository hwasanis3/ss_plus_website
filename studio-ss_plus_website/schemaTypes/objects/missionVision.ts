import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'missionVision',
  title: 'Mission Vision',
  type: 'object',
  fields: [
    defineField({ name: 'mission', title: 'Mission', type: 'text' }),
    defineField({ name: 'vision', title: 'Vision', type: 'text' }),
  ],
});
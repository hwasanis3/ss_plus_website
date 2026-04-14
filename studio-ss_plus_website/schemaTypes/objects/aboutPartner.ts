import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPartner',
  title: 'About Partner',
  type: 'object',
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'partnerName', title: 'Partner Name', type: 'string'}),
    defineField({name: 'supportEmail', title: 'Support Email', type: 'string'}),
    defineField({name: 'supportPhone', title: 'Support Phone', type: 'string'}),
  ],
})


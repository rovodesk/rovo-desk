import type { CollectionConfig } from 'payload'
import { Hero } from './blocks/Hero'

export const Pages: CollectionConfig = {
    slug: 'pages',

    admin: {
        useAsTitle: 'title',
    },

    access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
    },

    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },

        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },

        {
            name: 'link',
            type: 'text',
            admin: {
                description: 'Optional external link if this page redirects',
            },
        },

        {
            name: "sections",
            type: "blocks",
            blocks: [
                Hero,
            ],
        },

        {
            name: 'seo',
            type: 'group',
            label: 'SEO',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
}
import type { CollectionConfig } from 'payload'
import { canAccessUsers } from '../access/permissions'

export const BusinessCards: CollectionConfig = {
    slug: 'business-cards',
    labels: {
        singular: { en: 'Business Card', pt: 'Cartão de Visita' },
        plural: { en: 'Business Cards', pt: 'Cartões de Visitas' },
    },
    admin: {
        useAsTitle: 'slug',
        group: {
            en: 'Users & Config',
            pt: 'Usuários & Configuração',
        },
        hidden: ({ user }) => {
            if (!user) return true
            if (user.role === 'admin') return false
            const perms = (user as { permissions?: string[] }).permissions
            return !Array.isArray(perms) || (!perms.includes('users') && !perms.includes('business-cards'))
        },
    },
    access: {
        read: () => true, // API route will read this
        create: canAccessUsers,
        update: canAccessUsers,
        delete: canAccessUsers,
    },
    fields: [
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: { en: 'URL Slug', pt: 'Slug (URL)' },
            admin: {
                description: { pt: 'Ex: marcos (acessível via aracainteriores.com.br/cv/marcos)' }
            }
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            required: true,
            label: { en: 'User', pt: 'Usuário' },
            admin: {
                description: { pt: 'Usuário atrelado. O cartão puxará o nome e a foto (avatarUrl) deste usuário.' }
            }
        },
        {
            name: 'name',
            type: 'text',
            label: { en: 'Name (Override)', pt: 'Nome (Opcional)' },
            admin: {
                description: { pt: 'Se preenchido, vai sobrescrever o nome no cartão.' }
            }
        },
        {
            name: 'role',
            type: 'text',
            label: { en: 'Role', pt: 'Cargo' },
            admin: {
                description: { pt: 'Ex: Designer de Interiores' }
            }
        },
        {
            name: 'email',
            type: 'email',
            label: { en: 'Email', pt: 'E-mail de Contato' },
        },
        {
            name: 'phone',
            type: 'text',
            label: { en: 'Phone/WhatsApp', pt: 'Telefone / WhatsApp' },
            admin: {
                description: { pt: 'Ex: (11) 99745-8464' }
            }
        },
        {
            name: 'address',
            type: 'text',
            label: { en: 'Address', pt: 'Endereço Comercial' },
            defaultValue: 'Santo André - SP • Aracá Interiores',
        }
    ],
}

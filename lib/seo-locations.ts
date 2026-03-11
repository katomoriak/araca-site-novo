/**
 * SEO Local — Localizações atendidas pela Aracá Interiores.
 *
 * `slug`       → usado na URL  (ex: arquitetura-interiores-santo-andre)
 * `label`      → nome da cidade para exibição (H1, links, etc.)
 * `region`     → complemento textual para copywriting
 * `neighborhood` → bairros/regiões de referência (para rich copy)
 */
export interface CityLocation {
    slug: string
    label: string
    region: string
    neighborhood?: string
}

export const LOCATIONS: CityLocation[] = [
    {
        slug: 'santo-andre',
        label: 'Santo André',
        region: 'ABC Paulista',
        neighborhood: 'Centro, Vila Bastos, Jardim',
    },
    {
        slug: 'sao-caetano',
        label: 'São Caetano do Sul',
        region: 'ABC Paulista',
        neighborhood: 'Santa Maria, Nova Gerty',
    },
    {
        slug: 'sao-bernardo',
        label: 'São Bernardo do Campo',
        region: 'ABC Paulista',
        neighborhood: 'Centro, Rudge Ramos',
    },
    {
        slug: 'sao-paulo',
        label: 'São Paulo',
        region: 'Grande São Paulo',
    },
    {
        slug: 'moema',
        label: 'Moema',
        region: 'Zona Sul de São Paulo',
        neighborhood: 'Moema, Vila Nova Conceição',
    },
    {
        slug: 'brooklyn',
        label: 'Brooklyn',
        region: 'Zona Sul de São Paulo',
        neighborhood: 'Brooklyn, Chácara Santo Antônio',
    },
    {
        slug: 'pinheiros',
        label: 'Pinheiros',
        region: 'São Paulo',
        neighborhood: 'Pinheiros, Vila Madalena, Jardim Paulista',
    },
    {
        slug: 'zona-sul-sao-paulo',
        label: 'Zona Sul de São Paulo',
        region: 'São Paulo',
        neighborhood: 'Campo Belo, Santo Amaro, Saúde',
    },
]

/** Retorna uma CityLocation pelo slug, ou undefined se não encontrado. */
export function getLocationBySlug(slug: string): CityLocation | undefined {
    return LOCATIONS.find((loc) => loc.slug === slug)
}

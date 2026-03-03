import { BusinessCardForm } from '../BusinessCardForm'

export default function NovoBusinessCardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-2xl font-semibold">Novo Cartão de Visitas</h1>
            <BusinessCardForm isNew={true} />
        </div>
    )
}

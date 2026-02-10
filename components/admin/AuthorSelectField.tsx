'use client'

/**
 * Campo Autor como select nativo (mesmo padrão do CategorySelectField).
 * Carrega usuários da API e exibe o autor selecionado corretamente, evitando
 * bugs de CSS/HTML do Relationship padrão do Payload.
 */
import type { RelationshipFieldClientComponent } from 'payload'
import React from 'react'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  fieldBaseClass,
  useField,
} from '@payloadcms/ui'

function labelToString(lbl: unknown): string {
  if (typeof lbl === 'string') return lbl
  if (typeof lbl === 'object' && lbl !== null && 'en' in lbl && 'pt' in lbl) {
    const o = lbl as { en?: string; pt?: string }
    return o.pt ?? o.en ?? ''
  }
  return String(lbl ?? '')
}

function authorIdFromValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && value !== null && 'value' in value) {
    const v = (value as { value?: string | number }).value
    return v !== undefined && v !== null ? String(v) : ''
  }
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id?: string | number }).id
    return id !== undefined && id !== null ? String(id) : ''
  }
  return ''
}

type UserDoc = { id: string | number; name?: string }

export const AuthorSelectField: RelationshipFieldClientComponent = (props) => {
  const { field, path } = props
  const {
    admin: { className, description } = {},
    label,
    name,
    required,
  } = field

  const { setValue, showError, value: rawValue } = useField({
    potentiallyStalePath: path,
  })

  const [options, setOptions] = React.useState<Array<{ label: string; value: string }>>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/users?limit=500', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Falha ao carregar usuários'))))
      .then((data: { docs?: UserDoc[] }) => {
        if (cancelled || !data?.docs) return
        setOptions(
          data.docs.map((u) => ({
            label: u.name ?? String(u.id),
            value: String(u.id),
          })),
        )
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = authorIdFromValue(rawValue)
  const selectValue = value === '' ? '' : value

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const raw = e.target.value
      // Relationship armazena ID (string ou number); vazio = undefined para validação.
      const newValue = raw === '' ? undefined : raw
      setValue(newValue)
    },
    [setValue],
  )

  return (
    <div
      className={[fieldBaseClass, 'select', className, showError && 'error']
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
    >
      <FieldLabel
        label={labelToString(label ?? name)}
        path={path}
        required={required}
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError path={path} showError={showError} />
        <select
          className={`${fieldBaseClass}__input`}
          id={path}
          name={path}
          onChange={handleChange}
          value={selectValue}
          disabled={loading}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {description && (
        <FieldDescription description={description} path={path} />
      )}
    </div>
  )
}

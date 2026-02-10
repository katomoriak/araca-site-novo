'use client'

/**
 * Campo Select customizado para Category (e outros selects estáticos).
 * Garante que o valor selecionado seja exibido corretamente no admin do Payload 3,
 * contornando um bug conhecido onde o Select padrão pode ficar vazio após seleção.
 */
import type { SelectFieldClientComponent } from 'payload'
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

function formatOptions(
  options: Array<{ label?: unknown; value?: unknown } | string>,
): Array<{ label: string; value: string }> {
  return options.map((opt) =>
    typeof opt === 'object' && opt !== null && 'value' in opt
      ? { label: labelToString(opt.label), value: String(opt.value) }
      : { label: String(opt), value: String(opt) },
  )
}

export const CategorySelectField: SelectFieldClientComponent = (props) => {
  const { field, path, onChange: onChangeFromProps, value: valueFromProps } = props

  const {
    admin: { className, description } = {},
    label,
    name,
    options: optionsFromField = [],
    required,
  } = field

  const options = React.useMemo(
    () => formatOptions(optionsFromField),
    [optionsFromField],
  )

  const { setValue, showError, value: valueFromField = undefined } = useField({
    potentiallyStalePath: path,
  })

  const value = valueFromField ?? valueFromProps

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const raw = e.target.value
      const newValue = raw === '' ? undefined : raw
      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(newValue ?? '')
      }
      setValue(newValue)
    },
    [onChangeFromProps, setValue, path, value],
  )

  const selectValue =
    value === undefined || value === null ? '' : String(value)

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

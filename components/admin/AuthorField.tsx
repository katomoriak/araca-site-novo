'use client'

/**
 * Campo Autor (relationship para users) que garante:
 * 1. Valor no formato que o Relationship do Payload espera ({ relationTo, value }) para exibir o nome.
 * 2. Objeto populado ou ID puro são normalizados para esse formato para o select resolver a opção e buscar o label.
 */
import type { RelationshipFieldClientComponent } from 'payload'
import { RelationshipField, useField } from '@payloadcms/ui'
import { normalizeRelationshipValue } from '@payloadcms/ui/utilities/normalizeRelationshipValue'
import React from 'react'

const USERS = 'users'

export const AuthorField: RelationshipFieldClientComponent = (props) => {
  const { field, path } = props
  const relationTo = Array.isArray(field.relationTo) ? field.relationTo[0] : field.relationTo
  // validate omitido no useField: RelationshipField (renderizado abaixo) recebe props e aplica validação
  const { setValue, value } = useField({ potentiallyStalePath: path })

  // Garante que o valor esteja no formato { relationTo, value } para o RelationshipField
  // conseguir buscar a opção e exibir o nome do autor (createRelationMap + findOptionsByValue).
  React.useEffect(() => {
    if (value == null) return
    const id = normalizeRelationshipValue(value, relationTo ?? USERS)
    if (id == null) return
    const targetRelation = relationTo ?? USERS
    const shape = { relationTo: targetRelation, value: id }
    const currentShape =
      value && typeof value === 'object' && 'relationTo' in value && 'value' in value
        ? value
        : null
    if (
      !currentShape ||
      currentShape.relationTo !== shape.relationTo ||
      String(currentShape.value) !== String(shape.value)
    ) {
      setValue(shape, false)
    }
  }, [value, relationTo, setValue])

  return <RelationshipField {...props} />
}

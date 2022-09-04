import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"

export function assertNoDuplicateProperties(
  ctx: Ctx,
  properties: Array<Exps.Property>,
  found: Array<Exps.Property> = [],
): void {
  if (properties.length === 0) return

  const [property, ...restProperties] = properties

  if (found.find(({ name }) => name === property.name)) {
    throw new ElaborationError(`duplicate properties: ${property.name}`)
  }

  assertNoDuplicateProperties(ctx, restProperties, [...found, property])
}
import { ElaborationError } from "../errors"
import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function foldMultiFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, foldMultiFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      throw new ElaborationError(
        `foldMultiFn is not implemented for exp: ${binding.kind}`
      )
    }
  }
}

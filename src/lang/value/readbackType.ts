import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { readbackNeutral } from "../neutral"
import * as Values from "../value"
import { applyClosure, readback, Value } from "../value"

export function readbackType(ctx: Ctx, type: Value): Core {
  switch (type.kind) {
    case "Type": {
      /**
         TODO Maybe a scope bug.

         let U = Type

         function f(Type: (Type) -> Type) {
         // Problem: In this scope,
         // `U` is `readback` to `Cores.Var("Type")`,
         // `Type` is also `readback` to `Cores.Var("Type")`,
         // but they should not be equal (if we implement equal by NbE).

         // Solution: `Type` should not be `readback` to `Cores.Var("Type")`.
         }
      **/

      return Cores.Var("Type")
    }

    case "String": {
      return Cores.Var("String")
    }

    case "Trivial": {
      return Cores.Var("Trivial")
    }

    case "TypedNeutral": {
      /**
         The `type.type` are ignored here, maybe we should use them to debug.
      **/

      return readbackNeutral(ctx, type.neutral)
    }

    case "Pi": {
      const freshName = freshenInCtx(ctx, type.retTypeClosure.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const argTypeCore = readback(ctx, Values.Type(), type.argType)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(ctx, retTypeValue)
      return Cores.Pi(freshName, argTypeCore, retTypeCore)
    }

    case "Sigma": {
      const freshName = freshenInCtx(ctx, type.cdrTypeClosure.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.carType, variable)
      const carTypeCore = readback(ctx, Values.Type(), type.carType)
      const cdrTypeValue = applyClosure(type.cdrTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.carType, ctx)
      const cdrTypeCore = readbackType(ctx, cdrTypeValue)
      return Cores.Sigma(freshName, carTypeCore, cdrTypeCore)
    }

    default: {
      throw new ElaborationError(
        `readbackType is not implemented for type: ${type.kind}`
      )
    }
  }
}
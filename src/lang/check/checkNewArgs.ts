import { check } from "../check"
import { applyClosure } from "../closure"
import { Core } from "../core"
import { Ctx, CtxCons } from "../ctx"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { readback } from "../readback"
import * as Values from "../value"

export function checkNewArgs(
  mod: Mod,
  ctx: Ctx,
  args: Array<Exps.Arg>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      if (args.length !== 0) {
        throw new Errors.ElaborationError(
          `checkNewArgs too many arguments when calling new`,
          {},
        )
      }

      return {}
    }

    case "ClazzCons": {
      if (args.length === 0) {
        throw new Errors.ElaborationError(
          `checkNewArgs not enough arguments when calling new, require property: ${clazz.name}`,
          {},
        )
      }

      const [arg, ...restArgs] = args
      const propertyCore = check(mod, ctx, arg.exp, clazz.propertyType)
      const propertyValue = evaluate(mod.ctxToEnv(ctx), propertyCore)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      Values.assertClazzInCtx(mod, ctx, rest)
      ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
      return {
        [clazz.name]: propertyCore,
        ...checkNewArgs(mod, ctx, restArgs, rest),
      }
    }

    case "ClazzFulfilled": {
      const propertyCore = readback(
        mod,
        ctx,
        clazz.propertyType,
        clazz.property,
      )

      return {
        [clazz.name]: propertyCore,
        ...checkNewArgs(mod, ctx, args, clazz.rest),
      }
    }
  }
}
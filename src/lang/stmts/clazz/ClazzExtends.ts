import { evaluate } from "../../core"
import * as Exps from "../../exp"
import { Exp, infer } from "../../exp"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt } from "../../stmt"
import * as Values from "../../value"

export class ClazzExtends extends Stmt {
  constructor(
    public name: string,
    public parent: Exp,
    public clazz: Exps.ClazzUnfolded,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferredParent = infer(mod, mod.ctx, this.parent)
    const parentClazz = evaluate(mod.env, inferredParent.core)
    Values.assertClazz(parentClazz)
    const ctx = Values.clazzExtendCtx(mod, mod.ctx, parentClazz)
    // const inferred = infer(mod, ctx, this.clazz)
    // const value = evaluate(
    //   mod.env,
    //   Cores.appendClazz(inferredParent.core, inferred.core),
    // )
    // mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}

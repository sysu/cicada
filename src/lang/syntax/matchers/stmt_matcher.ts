import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import * as Exps from "../../exp"
import type { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:check": ({ exp, t }, { span }) =>
      new Stmts.Check(matchers.exp_matcher(exp), matchers.exp_matcher(t), span),
    "stmt:let": ({ name, exp }, { span }) =>
      new Stmts.Let(pt.str(name), matchers.exp_matcher(exp), span),
    "stmt:let_the": ({ name, t, exp }, { span }) =>
      new Stmts.LetThe(
        pt.str(name),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
        span,
      ),
    "stmt:let_function": ({ name, bindings, sequence }, { span }) =>
      new Stmts.Let(
        pt.str(name),
        Exps.FnUnfolded(
          matchers.fn_bindings_matcher(bindings),
          matchers.sequence_matcher(sequence),
        ),
      ),
    "stmt:let_function_with_ret_type": (
      { name, bindings, ret_t, sequence },
      { span },
    ) =>
      new Stmts.Let(
        pt.str(name),
        Exps.FnUnfoldedWithRetType(
          matchers.fn_bindings_matcher(bindings),
          matchers.exp_matcher(ret_t),
          matchers.sequence_matcher(sequence),
        ),
      ),
    "stmt:compute": ({ exp }, { span }) =>
      new Stmts.Compute(matchers.exp_matcher(exp), span),
    "stmt:clazz": ({ name, bindings }, { span }) =>
      new Stmts.Clazz(
        pt.str(name),
        Exps.ClazzUnfolded(
          pt.matchers
            .zero_or_more_matcher(bindings)
            .map(matchers.clazz_binding_matcher),
          pt.str(name),
          span,
        ),
        span,
      ),
    "stmt:class_extends": ({ name, parent, bindings }, { span }) =>
      new Stmts.ClazzExtends(
        pt.str(name),
        matchers.operator_matcher(parent),
        Exps.ClazzUnfolded(
          pt.matchers
            .zero_or_more_matcher(bindings)
            .map(matchers.clazz_binding_matcher),
          pt.str(name),
          span,
        ),
        span,
      ),
    "stmt:include": ({ types, last_type }, { span }) =>
      new Stmts.Include(
        [
          ...pt.matchers.zero_or_more_matcher(types).map(matchers.exp_matcher),
          matchers.exp_matcher(last_type),
        ],
        span,
      ),
    "stmt:solve": ({ bindings, equations }, { span }) =>
      new Stmts.Solve(
        matchers.solve_bindings_matcher(bindings),
        pt.matchers
          .zero_or_more_matcher(equations)
          .map(matchers.equation_matcher),
        span,
      ),
    "stmt:solve_empty_bindings": ({ equations }, { span }) =>
      new Stmts.Solve(
        [],
        pt.matchers
          .zero_or_more_matcher(equations)
          .map(matchers.equation_matcher),
        span,
      ),
    "stmt:import": ({ bindings, path }, { span }) =>
      new Stmts.Import(
        pt.matchers
          .zero_or_more_matcher(bindings)
          .map(matchers.import_binding_matcher),
        pt.trim_boundary(pt.str(path), 1),
        span,
      ),
  })(tree)
}

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

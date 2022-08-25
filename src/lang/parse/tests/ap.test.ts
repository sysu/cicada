import { expect, test } from "vitest"
import { Ap, Var } from "../../Exp"
import { parseExp } from "../index"
import { deleteUndefined } from "./utils"

test("parse Ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(Ap(Var("f"), [{ kind: "plain", exp: Var("x") }]))
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(
      Ap(Var("f"), [
        { kind: "plain", exp: Var("x") },
        { kind: "plain", exp: Var("y") },
      ])
    )
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(
      Ap(Ap(Var("f"), [{ kind: "plain", exp: Var("x") }]), [
        { kind: "plain", exp: Var("y") },
      ])
    )
  )
})

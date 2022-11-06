import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve Clazz", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  class { a: A, b: B } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- subclazz", async () => {
  const output = await runCode(`

solve (A: Type) {
  class { a: A } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String }"')
})

test("solve Clazz -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  class { c: class { a: A, b: B } } = class { c: class { a: String, b: String } }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  class { c: class { a: A, b: B }, b: String } =
  class { c: class { a: String, b: String }, b: B }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve ClazzCons -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  C = class { a: A, b: B }
  A = String
  B = String
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{ A: String, B: String, C: class {
      a: String
      b: String
    } }"
  `,
  )
})

test("solve ClazzFulfilled -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type, a: A, b: B) {
  C = class { a: A = a, b: B = b }
  A = String
  B = String
  a = "a"
  b = "b"
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{ A: String, B: String, C: class {
      a: String = \\"a\\"
      b: String = \\"b\\"
    }, a: \\"a\\", b: \\"b\\" }"
  `,
  )
})

test("solve Clazz -- occur", async () => {
  await expectCodeToFail(
    `

solve (A: Type) {
  class { a: A } = A
}

`,
    Errors.ElaborationError,
  )
})

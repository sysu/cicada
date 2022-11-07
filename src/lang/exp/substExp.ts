import * as Exps from "../exp"
import { Exp } from "../exp"
import { freshen } from "../utils/freshen"

export function substExp(body: Exp, name: string, exp: Exp): Exp {
  switch (body.kind) {
    case "Var": {
      if (body.name === name) {
        return exp
      } else {
        return body
      }
    }

    case "Pi": {
      if (body.name === name) {
        return Exps.Pi(
          body.name,
          substExp(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const retType = substExp(body.retType, body.name, Exps.Var(freshName))
        return Exps.Pi(
          body.name,
          substExp(body.argType, name, exp),
          substExp(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiImplicit": {
      if (body.name === name) {
        return Exps.PiImplicit(
          body.name,
          substExp(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const retType = substExp(body.retType, body.name, Exps.Var(freshName))
        return Exps.PiImplicit(
          body.name,
          substExp(body.argType, name, exp),
          substExp(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiUnfolded": {
      return substExp(Exps.foldPi(body.bindings, body.retType), name, exp)
    }

    case "Ap": {
      return Exps.Ap(
        substExp(body.target, name, exp),
        substExp(body.arg, name, exp),
        body.span,
      )
    }

    case "ApImplicit": {
      return Exps.ApImplicit(
        substExp(body.target, name, exp),
        substExp(body.arg, name, exp),
        body.span,
      )
    }

    case "ApUnfolded": {
      return substExp(Exps.foldAp(body.target, body.args), name, exp)
    }

    case "Fn": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.Fn(body.name, substExp(ret, name, exp), body.span)
      }
    }

    case "FnAnnotated": {
      if (body.name === name) {
        return Exps.FnAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnImplicit": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicit(body.name, substExp(ret, name, exp), body.span)
      }
    }

    case "FnImplicitAnnotated": {
      if (body.name === name) {
        return Exps.FnImplicitAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicitAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnUnfolded": {
      return substExp(Exps.foldFn(body.bindings, body.ret), name, exp)
    }

    case "FnUnfoldedWithRetType": {
      return substExp(
        Exps.foldFnWithRetType(body.bindings, body.retType, body.ret),
        name,
        exp,
      )
    }

    case "Sigma": {
      if (body.name === name) {
        return Exps.Sigma(
          body.name,
          substExp(body.carType, name, exp),
          body.cdrType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const cdrType = substExp(body.cdrType, body.name, Exps.Var(freshName))
        return Exps.Sigma(
          body.name,
          substExp(body.carType, name, exp),
          substExp(cdrType, name, exp),
          body.span,
        )
      }
    }

    case "SigmaUnfolded": {
      return substExp(Exps.foldSigma(body.bindings, body.cdrType), name, exp)
    }

    case "Cons": {
      return Exps.Cons(
        substExp(body.car, name, exp),
        substExp(body.cdr, name, exp),
        body.span,
      )
    }

    case "Quote": {
      return body
    }

    case "ClazzNull": {
      return body
    }

    case "ClazzCons": {
      if (body.localName === name) {
        return Exps.ClazzCons(
          body.name,
          body.localName,
          substExp(body.propertyType, name, exp),
          body.rest,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const rest = substExp(body.rest, body.name, Exps.Var(freshName))
        return Exps.ClazzCons(
          body.name,
          body.localName,
          substExp(body.propertyType, name, exp),
          substExp(rest, name, exp) as Exps.Clazz,
          body.span,
        )
      }
    }

    case "ClazzFulfilled": {
      if (body.localName === name) {
        return Exps.ClazzFulfilled(
          body.name,
          body.localName,
          substExp(body.propertyType, name, exp),
          substExp(body.property, name, exp),
          body.rest,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const rest = substExp(body.rest, body.name, Exps.Var(freshName))
        return Exps.ClazzFulfilled(
          body.name,
          body.localName,
          substExp(body.propertyType, name, exp),
          substExp(body.property, name, exp),
          substExp(rest, name, exp) as Exps.Clazz,
          body.span,
        )
      }
    }

    case "ClazzUnfolded": {
      return substExp(Exps.foldClazz(body.bindings), name, exp)
    }

    case "Objekt": {
      return Exps.Objekt(
        Object.fromEntries(
          Object.entries(body.properties).map(([propertyName, property]) => [
            propertyName,
            substExp(property, name, exp),
          ]),
        ),
        body.span,
      )
    }

    case "ObjektUnfolded": {
      return Exps.ObjektUnfolded(
        body.properties.map((property) => substProperty(property, name, exp)),
        body.span,
      )
    }

    case "New": {
      return Exps.New(
        body.name,
        Object.fromEntries(
          Object.entries(body.properties).map(([propertyName, property]) => [
            propertyName,
            substExp(property, name, exp),
          ]),
        ),
        body.span,
      )
    }

    case "NewUnfolded": {
      return Exps.NewUnfolded(
        body.name,
        body.properties.map((property) => substProperty(property, name, exp)),
        body.span,
      )
    }

    case "NewAp": {
      return Exps.NewAp(
        body.name,
        body.args.map((arg) => substArg(arg, name, exp)),
        body.span,
      )
    }

    case "Dot": {
      return Exps.Dot(substExp(body.target, name, exp), body.name, body.span)
    }

    case "SequenceLet": {
      if (body.name === name) {
        return Exps.SequenceLet(
          body.name,
          substExp(body.exp, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.SequenceLet(
          body.name,
          substExp(body.exp, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "SequenceLetThe": {
      if (body.name === name) {
        return Exps.SequenceLetThe(
          body.name,
          substExp(body.type, name, exp),
          substExp(body.exp, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.SequenceLetThe(
          body.name,
          substExp(body.type, name, exp),
          substExp(body.exp, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "SequenceCheck": {
      return Exps.SequenceCheck(
        substExp(body.exp, name, exp),
        substExp(body.type, name, exp),
        substExp(body.ret, name, exp),
        body.span,
      )
    }

    case "SequenceUnfolded": {
      return substExp(Exps.foldSequence(body.bindings, body.ret), name, exp)
    }

    default: {
      return body
    }
  }
}

function substArg(arg: Exps.Arg, name: string, exp: Exp): Exps.Arg {
  switch (arg.kind) {
    case "ArgPlain": {
      return Exps.ArgPlain(substExp(arg.exp, name, exp))
    }

    case "ArgImplicit": {
      return Exps.ArgImplicit(substExp(arg.exp, name, exp))
    }
  }
}

function substProperty(
  property: Exps.Property,
  name: string,
  exp: Exp,
): Exps.Property {
  switch (property.kind) {
    case "PropertyPlain": {
      return Exps.PropertyPlain(
        property.name,
        substExp(property.exp, name, exp),
      )
    }

    case "PropertySpread": {
      return Exps.PropertySpread(substExp(property.exp, name, exp))
    }
  }
}

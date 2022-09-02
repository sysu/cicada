import { Neutral } from "../neutral"
import { Closure } from "./Closure"

export type Value =
  | TypedNeutral
  | Type
  | Pi
  | Fn
  | Sigma
  | Cons
  | String
  | Quote
  | Trivial
  | Sole
  | Clazz
  | Objekt

export type AlreadyType = Type | Pi | Sigma | String | Trivial | Clazz

export type TypedNeutral = {
  family: "Value"
  kind: "TypedNeutral"
  type: Value
  neutral: Neutral
}

export function TypedNeutral(type: Value, neutral: Neutral): TypedNeutral {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}

export type Type = {
  family: "Value"
  kind: "Type"
}

export function Type(): Type {
  return {
    family: "Value",
    kind: "Type",
  }
}

export type Pi = {
  family: "Value"
  kind: "Pi"
  argType: Value
  retTypeClosure: Closure
}

export function Pi(argType: Value, retTypeClosure: Closure): Pi {
  return {
    family: "Value",
    kind: "Pi",
    argType,
    retTypeClosure,
  }
}

export type Fn = {
  family: "Value"
  kind: "Fn"
  retClosure: Closure
}

export function Fn(retClosure: Closure): Fn {
  return {
    family: "Value",
    kind: "Fn",
    retClosure,
  }
}

export type Sigma = {
  family: "Value"
  kind: "Sigma"
  carType: Value
  cdrTypeClosure: Closure
}

export function Sigma(carType: Value, cdrTypeClosure: Closure): Sigma {
  return {
    family: "Value",
    kind: "Sigma",
    carType,
    cdrTypeClosure,
  }
}

export type Cons = {
  family: "Value"
  kind: "Cons"
  car: Value
  cdr: Value
}

export function Cons(car: Value, cdr: Value): Cons {
  return {
    family: "Value",
    kind: "Cons",
    car,
    cdr,
  }
}

export type String = {
  family: "Value"
  kind: "String"
}

export function String(): String {
  return {
    family: "Value",
    kind: "String",
  }
}

export type Quote = {
  family: "Value"
  kind: "Quote"
  literal: string
}

export function Quote(literal: string): Quote {
  return {
    family: "Value",
    kind: "Quote",
    literal,
  }
}

export type Trivial = {
  family: "Value"
  kind: "Trivial"
}

export function Trivial(): Trivial {
  return {
    family: "Value",
    kind: "Trivial",
  }
}

export type Sole = {
  family: "Value"
  kind: "Sole"
}

export function Sole(): Sole {
  return {
    family: "Value",
    kind: "Sole",
  }
}

export type Clazz = ClazzCons | ClazzFulfilled | ClazzNull

export type ClazzCons = {
  family: "Value"
  kind: "ClazzCons"
  name: string
  propertyType: Value
  restClosure: Closure
}

export function ClazzCons(
  name: string,
  propertyType: Value,
  restClosure: Closure
): ClazzCons {
  return {
    family: "Value",
    kind: "ClazzCons",
    name,
    propertyType,
    restClosure,
  }
}

export type ClazzFulfilled = {
  family: "Value"
  kind: "ClazzFulfilled"
  name: string
  property: Value
  propertyType: Value
  restClosure: Closure
}

export function ClazzFulfilled(
  name: string,
  property: Value,
  propertyType: Value,
  restClosure: Closure
): ClazzFulfilled {
  return {
    family: "Value",
    kind: "ClazzFulfilled",
    name,
    property,
    propertyType,
    restClosure,
  }
}

export type ClazzNull = {
  family: "Value"
  kind: "ClazzNull"
}

export function ClazzNull(): ClazzNull {
  return {
    family: "Value",
    kind: "ClazzNull",
  }
}

export type Objekt = {
  family: "Value"
  kind: "Objekt"
  properties: Record<string, Value>
}

export function Objekt(properties: Record<string, Value>): Objekt {
  return {
    family: "Value",
    kind: "Objekt",
    properties,
  }
}

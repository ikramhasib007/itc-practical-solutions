export {}

declare global {
  interface String {
    toCamelCase(): string
    toCapitalizeFirst(): string
  }
}

String.prototype.toCamelCase = function (): string {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g, (ltr, idx) =>
    idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
  ).replace(/\s+|-/g, '')
}

String.prototype.toCapitalizeFirst = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

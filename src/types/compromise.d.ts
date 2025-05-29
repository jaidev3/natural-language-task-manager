declare module "compromise" {
  interface Compromise {
    match(pattern: string): Compromise;
    text(): string;
    json(): any[];
    people(): Compromise;
    dates(): Compromise;
    nouns(): Compromise;
    verbs(): Compromise;
    has(term: string): boolean;
    normalize(): Compromise;
    out(format?: string): any;
  }

  function nlp(text: string): Compromise;
  export = nlp;
}

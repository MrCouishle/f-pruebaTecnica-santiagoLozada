export class RouletteNumber implements IRouletteNumber {
  id: number = 0;
  color: string = "";

  constructor(init?: Partial<IRouletteNumber>) {
    Object.assign(this, init);
  }

  static create(init?: Partial<IRouletteNumber>): RouletteNumber {
    return new RouletteNumber(init);
  }

  validate(): string {
    const validations: Record<string, string> = {};
    for (const [key, message] of Object.entries(validations)) {
      if (!(this as any)[key]) {
        return message;
      }
    }
    return "";
  }
}

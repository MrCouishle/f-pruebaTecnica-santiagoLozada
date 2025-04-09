export class Result implements IResult {
  id: string = "";
  betValue: number = 0;
  profit: number = 0;
  remainingBalance: number = 0;
  winner: boolean = false;
  userId: string = "";
  user!: IUser;
  rouletteNumber: number = 0;
  createAt: string = "";

  constructor(init?: Partial<IResult>) {
    Object.assign(this, init);
  }

  static create(init?: Partial<IResult>): Result {
    return new Result(init);
  }

  validate(): string {
    const validations: Record<string, string> = {
      name: "El nombre es obligatorio.",
    };
    for (const [key, message] of Object.entries(validations)) {
      if (!(this as any)[key]) {
        return message;
      }
    }

    if (this.betValue <= 0) {
      return "El valor apostado debe ser mayor a 0.";
    }

    if (this.remainingBalance <= 0) {
      return "El valor restante debe ser mayor a 0.";
    }

    if (this.rouletteNumber < 0 || this.rouletteNumber > 37) {
      return "El número de la ruleta es inválido.";
    }

    return "";
  }
}

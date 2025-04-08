export class User implements IUser {
  id: string = "";
  name: string = "";
  balance: number = 0;
  createAt: string = "";

  constructor(init?: Partial<IUser>) {
    Object.assign(this, init);
  }

  static create(init?: Partial<IUser>): User {
    return new User(init);
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

    if (this.balance <= 0) {
      return "El crédito  debe ser mayor a 0.";
    }

    return "";
  }
}

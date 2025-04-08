interface IResult {
  id: string;
  betValue: number;
  profit: number;
  remainingBalance: number;
  userId: string;
  user: IUser;
  rouletteNumber: number;
  createAt: string;
}

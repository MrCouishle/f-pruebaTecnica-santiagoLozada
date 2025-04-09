interface IResult {
  id: string;
  betValue: number;
  profit: number;
  remainingBalance: number;
  currentBalance: number;
  winner: boolean;
  userId: string;
  user: IUser;
  rouletteNumber: number;
  createAt: string;
}

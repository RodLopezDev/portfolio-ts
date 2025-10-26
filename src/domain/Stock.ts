/**
 * Represents a stock with a symbol and price
 */
class Stock {
  constructor(
    private readonly symbol: string,
    private readonly price: number
  ) {}

  getCurrentPrice(): number {
    return this.price;
  }

  getSymbol(): string {
    return this.symbol;
  }
}

export default Stock;

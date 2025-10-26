import Stock from "./Stock";

class Portfolio {
  constructor(
    private readonly stocks: Record<string, Stock>,
    private readonly holdings: Record<string, number>,
    private readonly allocations: Record<string, number>
  ) {}

  private getHoldingsAsList(): [string, number][] {
    return Object.entries(this.holdings);
  }

  private getAllocationsAsList(): [string, number][] {
    return Object.entries(this.allocations);
  }

  /**
   * Get the total value of the portfolio
   * @returns {number} The total value of the portfolio
   */
  getTotalValue(): number {
    return this.getHoldingsAsList().reduce((total, [symbol, shares]) => {
      const stock = this.stocks[symbol]!;
      return total + shares * stock.getCurrentPrice();
    }, 0);
  }

  /**
   * Get the current allocations of the portfolio
   * @returns {Record<string, number>} The current allocations of the portfolio
   */
  getCurrentAllocations(): Record<string, number> {
    const totalValue = this.getTotalValue();
    const result: Record<string, number> = {};

    for (const [symbol, shares] of this.getHoldingsAsList()) {
      const stock = this.stocks[symbol]!;
      const value = shares * stock.getCurrentPrice();
      result[symbol] = Number((value / totalValue).toFixed(2));
    }

    return result;
  }

  /**
   * Determines how many shares to buy/sell to reach the target allocation.
   * Returns a map of symbol -> sharesToBuyOrSell
   * Positive = buy, Negative = sell.
   * @returns {Record<string, number>} A map of symbol -> sharesToBuyOrSell
   */
  rebalance(): Record<string, number> {
    const totalValue = this.getTotalValue();
    const actions: Record<string, number> = {};

    for (const [symbol, targetPct] of this.getAllocationsAsList()) {
      const stock = this.stocks[symbol]!;
      const shares = this.holdings[symbol]!;

      const currentValue = shares * stock.getCurrentPrice();
      const targetValue = totalValue * targetPct;
      const difference = targetValue - currentValue;

      actions[symbol] = difference / stock.getCurrentPrice();
    }

    return actions;
  }
}

export default Portfolio;

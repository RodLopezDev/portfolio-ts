import Portfolio from "./domain/Portfolio";
import Stock from "./domain/Stock";

const meta = new Stock("META", 500);
const aapl = new Stock("AAPL", 200);

const portfolio = new Portfolio(
  {
    [meta.getSymbol()]: meta,
    [aapl.getSymbol()]: aapl,
  },
  {
    [meta.getSymbol()]: 10,
    [aapl.getSymbol()]: 300,
  },
  {
    [meta.getSymbol()]: 0.5,
    [aapl.getSymbol()]: 0.5,
  }
);

console.log(`Total value: ${portfolio.getTotalValue()}`);
console.log(
  `Current allocations: ${JSON.stringify(portfolio.getCurrentAllocations())}`
);
console.log(`Rebalance: ${JSON.stringify(portfolio.rebalance())} \n`);

const rebalanceActions = portfolio.rebalance();
console.log("Rebalance actions:");
for (const [symbol, shares] of Object.entries(rebalanceActions)) {
  if (shares === 0) continue;
  if (shares > 0) {
    console.log(`You need to buy ${shares} shares of ${symbol}`);
  } else {
    console.log(`You need to sell ${shares * -1} shares of ${symbol}`);
  }
}

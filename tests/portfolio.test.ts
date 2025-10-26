import Portfolio from "../src/domain/Portfolio";
import Stock from "../src/domain/Stock";

describe("Portfolio Rebalance", () => {
  const meta = new Stock("META", 500);
  const aapl = new Stock("AAPL", 200);

  const initialMetaShares = 10;
  const initialAaplShares = 300;

  const targetMetaAllocation = 0.5;
  const targetAaplAllocation = 0.5;

  const portfolio = new Portfolio(
    {
      [meta.getSymbol()]: meta,
      [aapl.getSymbol()]: aapl,
    },
    {
      [meta.getSymbol()]: initialMetaShares,
      [aapl.getSymbol()]: initialAaplShares,
    },
    {
      [meta.getSymbol()]: targetMetaAllocation,
      [aapl.getSymbol()]: targetAaplAllocation,
    }
  );

  test("calculates total portfolio value correctly", () => {
    // it could be calculated manually for use case, but I prefer to use the portfolio object
    const totalValue =
      initialMetaShares * meta.getCurrentPrice() +
      initialAaplShares * aapl.getCurrentPrice();

    // Validate if method is working correctly
    expect(portfolio.getTotalValue()).toBe(totalValue);
  });

  test("computes current allocations correctly", () => {
    // it could be calculated manually for use case, but I prefer to use the portfolio object
    const totalValue = portfolio.getTotalValue();
    const metaValue = initialMetaShares * meta.getCurrentPrice();
    const aaplValue = initialAaplShares * aapl.getCurrentPrice();

    // Validate if method is working correctly
    const allocs = portfolio.getCurrentAllocations();
    expect(allocs[meta.getSymbol()]).toBeCloseTo(metaValue / totalValue, 2);
    expect(allocs[aapl.getSymbol()]).toBeCloseTo(aaplValue / totalValue, 2);
  });

  test("suggests correct rebalance actions", () => {
    const actions = portfolio.rebalance();

    // Get the shares to buy and sell
    const metaSharesToBuy = actions[meta.getSymbol()];
    const aaplSharesToSell = actions[aapl.getSymbol()];

    // Validate if the shares to buy and sell are correct
    expect(metaSharesToBuy).toBeGreaterThan(0); // buy for this use case
    expect(aaplSharesToSell).toBeLessThan(0); // sell for this use case

    // it could be calculated manually for use case, but I prefer to use the portfolio object
    const totalValue = portfolio.getTotalValue();
    const metaValue = initialMetaShares * meta.getCurrentPrice();
    const aaplValue = initialAaplShares * aapl.getCurrentPrice();
    const metaTargetValue = totalValue * targetMetaAllocation - metaValue;
    const aaplTargetValue = totalValue * targetAaplAllocation - aaplValue;

    // Validate if the shares to buy and sell are correct
    expect(metaSharesToBuy).toBeCloseTo(
      metaTargetValue / meta.getCurrentPrice(),
      1
    );
    expect(aaplSharesToSell).toBeCloseTo(
      aaplTargetValue / aapl.getCurrentPrice(),
      1
    );
  });

  test("returns empty actions if no rebalance is needed, take rebalance actions as reference", () => {
    const actions = portfolio.rebalance();

    const newPortfolio = new Portfolio(
      {
        [meta.getSymbol()]: meta,
        [aapl.getSymbol()]: aapl,
      },
      {
        [meta.getSymbol()]: initialMetaShares + actions[meta.getSymbol()]!,
        [aapl.getSymbol()]: initialAaplShares + actions[aapl.getSymbol()]!,
      },
      {
        [meta.getSymbol()]: targetMetaAllocation,
        [aapl.getSymbol()]: targetAaplAllocation,
      }
    );

    const newActions = newPortfolio.rebalance();
    expect(newActions[meta.getSymbol()]).toEqual(0);
    expect(newActions[aapl.getSymbol()]).toEqual(0);
  });
});

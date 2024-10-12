import request from "supertest";
import app from "./index";

describe("E-to-E-1", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // resets the data values
  });

  it("this test just checks the response messages and status", async () => {
    // Step 1: Create a new user (User5)
    let response = await request(app).get("/user/create/user5");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user5 created");

    // Step 2: Add balance to user5
    response = await request(app).post("/onramp/inr").send({
      userId: "user5",
      amount: 50000, // ₹500.00
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user5 with amount 50000");

    // Step 3: Create a new symbol
    response = await request(app).get(
      "/symbol/create/AAPL_USD_25_Oct_2024_14_00",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol AAPL_USD_25_Oct_2024_14_00 created",
    );

    // Step 4: Mint tokens for User5
    response = await request(app).post("/trade/mint").send({
      userId: "user5",
      stockSymbol: "AAPL_USD_25_Oct_2024_14_00",
      quantity: 25,
      price: 1000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 25 'yes' and 'no' tokens for user user5, remaining balance is 0",
    );

    // Step 5: User5 sells 10 'no' tokens
    response = await request(app).post("/order/sell").send({
      userId: "user5",
      stockSymbol: "AAPL_USD_25_Oct_2024_14_00",
      quantity: 10,
      price: 1000,
      stockType: "no",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 10 'no' options at price 1000.",
    );

    // Step 6: Create User6 and buy the 'no' tokens from the order book
    response = await request(app).get("/user/create/user6");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user6 created");

    // Add balance to user6
    response = await request(app).post("/onramp/inr").send({
      userId: "user6",
      amount: 20000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user6 with amount 20000");

    // User6 buys 10 'no' tokens
    response = await request(app).post("/order/buy").send({
      userId: "user6",
      stockSymbol: "AAPL_USD_25_Oct_2024_14_00",
      quantity: 10,
      price: 1000,
      stockType: "no",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed");

    // Fetch balances after the trade
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user6"]).toEqual({
      balance: 10000, // 20000 - (10 * 1000)
      locked: 0,
    });
    expect(response.body["user5"]).toEqual({
      balance: 10000, // 0 + (10 * 1000)
      locked: 0,
    });
  });
});

describe("E-to-E-2", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // resets the data values
  });

  it("this test checks the response values , status as well as state of the variables at regular intervals", async () => {
    // Step 1: Create a new user (User3)
    let response = await request(app).get("/user/create/user3");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user3 created");

    // Step 2: Add balance to user3
    response = await request(app).post("/onramp/inr").send({
      userId: "user3",
      amount: 100000, // ₹1000.00
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user3 with amount 100000");

    // Fetch INR_BALANCES after adding balance
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user3"]).toEqual({
      balance: 100000,
      locked: 0,
    });

    // Step 3: Create a new symbol
    response = await request(app).get(
      "/symbol/create/ETH_USD_20_Oct_2024_10_00",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol ETH_USD_20_Oct_2024_10_00 created",
    );

    // Step 4: Mint tokens for User3
    response = await request(app).post("/trade/mint").send({
      userId: "user3",
      stockSymbol: "ETH_USD_20_Oct_2024_10_00",
      quantity: 50,
      price: 2000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 50 'yes' and 'no' tokens for user user3, remaining balance is 0",
    );

    // Fetch STOCK_BALANCES after minting
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user3"]["ETH_USD_20_Oct_2024_10_00"]).toEqual({
      yes: { quantity: 50, locked: 0 },
      no: { quantity: 50, locked: 0 },
    });

    // Step 5: User3 sells 20 'yes' tokens
    response = await request(app).post("/order/sell").send({
      userId: "user3",
      stockSymbol: "ETH_USD_20_Oct_2024_10_00",
      quantity: 20,
      price: 2000,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 20 'yes' options at price 2000.",
    );

    // Fetch STOCK_BALANCES after selling
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user3"]["ETH_USD_20_Oct_2024_10_00"]["yes"]).toEqual({
      quantity: 30, // 50 - 20
      locked: 20, // Locked 20 units
    });

    // Step 6: Create User4 and buy the 'yes' tokens from the order book
    response = await request(app).get("/user/create/user4");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user4 created");

    // Add balance to user4
    response = await request(app).post("/onramp/inr").send({
      userId: "user4",
      amount: 60000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user4 with amount 60000");

    // User4 buys 20 'yes' tokens
    response = await request(app).post("/order/buy").send({
      userId: "user4",
      stockSymbol: "ETH_USD_20_Oct_2024_10_00",
      quantity: 20,
      price: 2000,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed");

    // Fetch balances after the trade
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user4"]).toEqual({
      balance: 20000, // 60000 - (20 * 2000)
      locked: 0,
    });
    expect(response.body["user3"]).toEqual({
      balance: 40000, // 0 + (20 * 2000)
      locked: 0,
    });

    // Fetch STOCK_BALANCES after the trade
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user4"]["ETH_USD_20_Oct_2024_10_00"]["yes"]).toEqual({
      quantity: 20,
      locked: 0,
    });
    expect(response.body["user3"]["ETH_USD_20_Oct_2024_10_00"]["yes"]).toEqual({
      quantity: 30, // Remaining after selling 20
      locked: 0,
    });
  });
});

describe("E-to-E-3", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // Reset the data values
  });

  it("should handle multiple matching orders and price priorities correctly", async () => {
    // Step 1: Create users (User1 and User2)
    let response = await request(app).get("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    response = await request(app).get("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    // Step 2: Create a symbol
    response = await request(app).get(
      "/symbol/create/ETH_USD_15_Oct_2024_12_00",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol ETH_USD_15_Oct_2024_12_00 created",
    );

    // Step 3: Add balance to users
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user1", amount: 500000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user2", amount: 300000 });

    // Check INR balances after adding funds
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user1"]).toEqual({ balance: 500000, locked: 0 });
    expect(response.body["user2"]).toEqual({ balance: 300000, locked: 0 });

    // Step 4: Mint tokens for User1
    response = await request(app).post("/trade/mint").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200,
      price: 1500,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 200 'yes' and 'no' tokens for user user1, remaining balance is 200000",
    );

    // Step 5: User1 places multiple sell orders at different prices
    await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1400, // Lower price
      stockType: "yes",
    });

    await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1500, // Higher price
      stockType: "yes",
    });

    // Check order book after placing multiple sell orders
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1400: { total: 100, orders: { user1: 100 } },
      1500: { total: 100, orders: { user1: 100 } },
    });

    // Step 6: Check stock locking after placing sell orders
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 200,
    });

    // Step 7: User2 places a buy order for 100 tokens, should match the lower price first (1400)
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order matched at best price 1400");

    // Check INR balances after matching the order
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({ balance: 160000, locked: 0 });

    // Step 8: Verify stock balances after matching
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 100, // 100 tokens still locked for the second sell order
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100, // Tokens bought
      locked: 0, // No tokens locked for buying
    });

    // Step 9: User2 places a buy order for 50 tokens, should partially match the 1500 sell
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Buy order matched partially, 50 remaining",
    );

    // Check INR balances after partial matching
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({ balance: 85000, locked: 0 });

    // Check order book after partial matching
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1500: { total: 50, orders: { user1: 50 } },
    });

    // Step 10: User1 cancels the remaining 50 sell order
    response = await request(app).post("/order/cancel").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sell order canceled");

    // Check the order book to ensure it's empty
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({}); // No orders left

    // Step 11: Verify stock balances after matching and canceling
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 50,
      locked: 0, // No locked balance after cancellation
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 150,
      locked: 0,
    });
  });

  it("should handle multiple buy orders with price priority matching", async () => {
    // Reset data and start fresh
    await request(app).post("/reset");

    // Step 1: Create users (User1 and User2)
    await request(app).get("/user/create/user1");
    await request(app).get("/user/create/user2");

    // Step 2: Add balance to users
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user1", amount: 500000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user2", amount: 300000 });

    // Step 3: Create a symbol and mint tokens for User1
    await request(app).get("/symbol/create/ETH_USD_15_Oct_2024_12_00");
    await request(app).post("/trade/mint").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200,
      price: 1500,
    });

    // Add stock balance check here
    let response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 200,
      locked: 0,
    });

    // Step 4: User1 places sell orders at two different prices
    await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1400,
      stockType: "yes",
    });

    await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1500,
      stockType: "yes",
    });

    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 200, // All 200 tokens locked for the sell orders
    });

    // Step 5: User2 places a buy order with a price lower than the lowest sell price
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1300,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and pending");

    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({
      balance: 235000, // 300000 - (50 * 1300)
      locked: 65000, // 50 * 1300 INR locked for pending buy order
    });

    // Check the order book and ensure no matching has occurred
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1400: { total: 100, orders: { user1: 100 } },
      1500: { total: 100, orders: { user1: 100 } },
    });

    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 200,
    });

    // Step 6: User2 increases the buy price to match the lowest sell order
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1400,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order matched at price 1400");

    // Verify that the order book is updated correctly
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1400: { total: 50, orders: { user1: 50 } }, // 50 remaining from the 1400 sell
      1500: { total: 100, orders: { user1: 100 } }, // No changes to the 1500 sell order
    });

    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 150,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 50,
      locked: 0,
    });

    // Verify INR balances after the order matching
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({ balance: 235000, locked: 0 });
  });
});

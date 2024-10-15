const request = require("supertest");
// if you have a ts project, do dist/index instead of /index and make sure you follow readme
const app = require("./index");

describe("E-to-E-1", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // resets the data values
  });

  it("this test just checks the response messages and status", async () => {
    // Step 1: Create a new user (User5)
    let response = await request(app).post("/user/create/user5");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user5 created");

    // Step 2: Add balance to user5
    response = await request(app).post("/onramp/inr").send({
      userId: "user5",
      amount: 50000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user5 with amount 50000");

    // Step 3: Create a new symbol
    response = await request(app).post(
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
    response = await request(app).post("/user/create/user6");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user6 created");

    // Add balance to user6
    response = await request(app).post("/onramp/inr").send({
      userId: "user6",
      amount: 20000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user6 with amount 20000");

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
      balance: 10000,
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
    let response = await request(app).post("/user/create/user3");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user3 created");

    // Step 2: Add balance to user3
    response = await request(app).post("/onramp/inr").send({
      userId: "user3",
      amount: 100000,
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
    response = await request(app).post(
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
      quantity: 30,
      locked: 20,
    });

    // Step 6: Create User4 and buy the 'yes' tokens from the order book
    response = await request(app).post("/user/create/user4");
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
      balance: 20000,
      locked: 0,
    });
    expect(response.body["user3"]).toEqual({
      balance: 40000,
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
      quantity: 30,
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
    let response = await request(app).post("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    response = await request(app).post("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    // Step 2: Create a symbol
    response = await request(app).post(
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

    // Insufficient INR Balance for User2 when placing buy order
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 500,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient INR balance");

    // Step 5: User1 places multiple sell orders at different prices
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

    // Insufficient Stock Balance for User1 when placing a sell order
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 300,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient stock balance");

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
      locked: 100,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100,
      locked: 0,
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
      locked: 0,
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
    await request(app).post("/user/create/user1");
    await request(app).post("/user/create/user2");

    // Step 2: Add balance to users
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user1", amount: 500000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user2", amount: 300000 });

    // Step 3: Create a symbol and mint tokens for User1
    await request(app).post("/symbol/create/ETH_USD_15_Oct_2024_12_00");
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
      locked: 200,
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
      balance: 235000,
      locked: 65000,
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

describe("E-to-E-4", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // Reset the data values
  });

  it("should handle multiple matching orders and price priorities correctly", async () => {
    // Step 1: Create users (User1 and User2)
    let response = await request(app).post("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    response = await request(app).post("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    // Step 2: Create a symbol
    response = await request(app).post(
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
      locked: 100,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100,
      locked: 0,
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
      locked: 0,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 150,
      locked: 0,
    });
  });

  it("should handle multiple buy orders with price priority matching when a third user introduces a matching sell price", async () => {
    // Reset data and start fresh
    await request(app).post("/reset");

    // Step 1: Create users (User1, User2, and User3)
    await request(app).post("/user/create/user1");
    await request(app).post("/user/create/user2");
    await request(app).post("/user/create/user3");

    // Step 2: Add balance to users
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user1", amount: 500000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user2", amount: 300000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user3", amount: 400000 });

    // Step 3: Create a symbol and mint tokens for User1 and User3
    await request(app).post("/symbol/create/ETH_USD_15_Oct_2024_12_00");
    await request(app).post("/trade/mint").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200,
      price: 1500,
    });

    await request(app).post("/trade/mint").send({
      userId: "user3",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1300,
    });

    // Add stock balance check here for User3
    let response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 200,
      locked: 0,
    });
    expect(response.body["user3"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100,
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
      balance: 235000,
      locked: 65000,
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

    // Step 6: User3 places a sell order at the price matching User2's buy order
    response = await request(app).post("/order/sell").send({
      userId: "user3",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1300,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sell order matched at price 1300");

    // Verify that the order book is updated correctly the buy order matches immediatly
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1400: { total: 100, orders: { user1: 100 } },
      1500: { total: 100, orders: { user1: 100 } },
    });

    // Check User3 and User2's stock balances after matching
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 200,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 50,
      locked: 0,
    });
    expect(response.body["user3"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 0,
      locked: 0,
    });

    // Verify INR balances after the order matching
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({ balance: 235000, locked: 0 });
    expect(response.body["user3"]).toEqual({ balance: 465000, locked: 0 });
  });
});

describe("E-to-E-5", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // Reset the data values
  });

  it("should handle multiple matching orders and price priorities correctly", async () => {
    // Step 1: Create users (User1 and User2)
    let response = await request(app).post("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    response = await request(app).post("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    // Step 2: Create a symbol
    response = await request(app).post(
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
      locked: 100,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100,
      locked: 0,
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
      locked: 0,
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 150,
      locked: 0,
    });
  });

  it("should create a corresponding 'no' sell order when placing a 'yes' buy order below market price", async () => {
    // Reset data
    await request(app).post("/reset");

    // Step 1: Create users (User1 and User2)
    await request(app).post("/user/create/user1");
    await request(app).post("/user/create/user2");

    // Step 2: Add balance to users (in paise)
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user1", amount: 50000000 });
    await request(app)
      .post("/onramp/inr")
      .send({ userId: "user2", amount: 30000000 });

    // Step 3: Create a symbol
    await request(app).post("/symbol/create/ETH_USD_15_Oct_2024_12_00");

    // Step 4: Mint tokens for User1
    let response = await request(app).post("/trade/mint").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100, // Mint 100 'yes' and 100 'no' tokens
      price: 600,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 100 'yes' and 'no' tokens for user user1, remaining balance is 49880000",
    );

    // Step 5: Check User1's balances after minting
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user1"]).toEqual({
      balance: 49880000,
      locked: 0,
    });

    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: { quantity: 100, locked: 0 },
      no: { quantity: 100, locked: 0 },
    });

    // Step 6: User1 places a sell order for 'yes' shares at 600 paise (6 rs)
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 600,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sell order placed and pending");

    // Step 7: Check the order book
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });

    // Step 8: User2 places a buy order for 'yes' shares at 500 paise (5 rs), below the current market price
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and pending");

    // Additional INR balance checks after placing the buy order
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({
      balance: 27500000,
      locked: 2500000,
    });

    // Additional stock balance checks after placing the buy order
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: { quantity: 0, locked: 0 },
      no: { quantity: 0, locked: 0 },
    });

    // Step 9: Check the order book again to verify the corresponding 'no' sell order
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["no"]).toEqual({
      500: { total: 50, orders: { user2: 50 } },
    });

    // Step 10: Check User2's balances
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({
      balance: 27500000,
      locked: 2500000,
    });

    // Step 11: User1 places a buy order for 'no' shares at 500 paise, matching User2's implicit sell order
    response = await request(app).post("/order/buy").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 500,
      stockType: "no",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order matched at price 500 paise");

    // Step 12: Check the order book to verify the orders have been matched and removed
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["no"]).toEqual({});

    // Step 13: Check final balances
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user1"]).toEqual({
      balance: 41500000,
      locked: 0,
    });
    expect(response.body["user2"]).toEqual({
      balance: 30000000,
      locked: 0,
    });

    // Step 14: Check final stock balances
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: { quantity: 0, locked: 100 },
      no: { quantity: 150, locked: 0 },
    });
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: { quantity: 50, locked: 0 },
      no: { quantity: 0, locked: 0 },
    });
  });
});

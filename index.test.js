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
    await request(app).post("/reset"); // resets the data values
  });

  it("this test checks the response values , more edge cases as well as status as well as state of the variables at regular intervals", async () => {
    // Step 1: Create a new user (User1)
    let response = await request(app).get("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    // Edge Case: Create the same user again
    response = await request(app).get("/user/create/user1");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");

    // Fetch INR_BALANCES after creating User1
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user1");
    expect(response.body["user1"]).toEqual({ balance: 0, locked: 0 });

    // Step 2: Create a new symbol
    response = await request(app).get(
      "/symbol/create/ETH_USD_15_Oct_2024_12_00",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol ETH_USD_15_Oct_2024_12_00 created",
    );

    // Fetch ORDERBOOK after creating symbol
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ETH_USD_15_Oct_2024_12_00");
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: {},
      no: {},
    });

    // Step 3: Add balance to user1
    response = await request(app).post("/onramp/inr").send({
      userId: "user1",
      amount: 500000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user1 with amount 500000");

    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user1"]).toEqual({
      balance: 500000,
      locked: 0,
    });

    // Step 4: Mint some quantities for User1
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

    // Fetch STOCK_BALANCES after minting
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user1");
    expect(response.body["user1"]).toHaveProperty("ETH_USD_15_Oct_2024_12_00");
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: { quantity: 200, locked: 0 },
      no: { quantity: 200, locked: 0 },
    });

    // Step 5: User1 sells some quantities of "yes"
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 100 'yes' options at price 1500.",
    );

    // Fetch STOCK_BALANCES after placing sell order
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 100,
      locked: 100,
    });

    // Step 6: User2 buys some "yes" options
    response = await request(app).get("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    response = await request(app).post("/onramp/inr").send({
      userId: "user2",
      amount: 300000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped successfully");

    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1500,
      stockType: "yes", // Buying "yes" tokens
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed");

    // Edge Case: Buying quantity more than available in the order book
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200, // Exceeds available quantity in the orderbook
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Not enough quantity in order book");

    // Edge Case: Try placing an order with a negative price
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: -1000, // Invalid price
      stockType: "no",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid price");

    // Fetch STOCK_BALANCES after trade execution
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user2"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 50,
      locked: 0,
    });
    expect(response.body["user1"]["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      quantity: 50, // Remaining after selling 50
      locked: 50, // Locked in pending orders
    });

    // Step 7: User1 tries to sell more tokens than they own
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200, // Exceeds available quantity
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient stock quantity");

    // Edge Case: Attempting to buy/sell a symbol that has expired
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00_expired",
      quantity: 50,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Symbol has expired");
  });
});

describe("E-to-E-4", () => {
  beforeAll(async () => {
    await request(app).post("/reset"); // resets the data values
  });

  it("final boss", async () => {
    // Step 1: Create a new user (User1)
    let response = await request(app).get("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created");

    // Step 2: Create a new symbol
    response = await request(app).get(
      "/symbol/create/ETH_USD_15_Oct_2024_12_00",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol ETH_USD_15_Oct_2024_12_00 created",
    );

    // Check the order book after creating symbol
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ETH_USD_15_Oct_2024_12_00");
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]).toEqual({
      yes: {},
      no: {},
    });

    // Step 3: Add balance to user1
    response = await request(app).post("/onramp/inr").send({
      userId: "user1",
      amount: 500000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped user1 with amount 500000");

    // Step 4: Mint some quantities for User1
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

    // Step 5: User1 sells some quantities of "yes"
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 100 'yes' options at price 1500.",
    );

    // Check order book after User1 places a sell order
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1500: { quantity: 100, userId: "user1" },
    });

    // Step 6: User2 buys some "yes" options
    response = await request(app).get("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created");

    response = await request(app).post("/onramp/inr").send({
      userId: "user2",
      amount: 300000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped successfully");

    // User2 places a buy order
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1500,
      stockType: "yes", // Buying "yes" tokens
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed");

    // Check order book after User2's buy order
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1500: { quantity: 50, userId: "user1" }, // Only 50 remain after execution
    });

    // Edge Case: User2 tries to buy with insufficient INR balance
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 100,
      price: 4000, // Exceeds available INR balance for user2
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient INR balance");

    // Test INR balance locking for user2 before order execution
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 50,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and pending");

    // Check INR balance locking for user2 after pending order
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({
      balance: 150000, // 225000 - (50 * 1500)
      locked: 75000, // 50 'yes' tokens at 1500 INR locked for pending order
    });

    // Check the order book after the pending buy order
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body["ETH_USD_15_Oct_2024_12_00"]["yes"]).toEqual({
      1500: { quantity: 50, userId: "user1" }, // Order still pending
    });

    // Step 7: User1 tries to sell more tokens than they own
    response = await request(app).post("/order/sell").send({
      userId: "user1",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00",
      quantity: 200, // Exceeds available quantity
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient stock quantity");

    // Edge Case: Attempting to buy/sell a symbol that has expired
    response = await request(app).post("/order/buy").send({
      userId: "user2",
      stockSymbol: "ETH_USD_15_Oct_2024_12_00_expired",
      quantity: 50,
      price: 1500,
      stockType: "yes",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Symbol has expired");
  });
});

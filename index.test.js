const request = require("supertest");
const app = require("./index");

//describe("POST /onramp/inr", () => {
//  it("should add INR to the user's balance", async () => {
//    const response = await request(app).post("/onramp/inr").send({
//      userId: "user1",
//      amount: 10000,
//    });
//    expect(response.status).toBe(200);
//    expect(response.body.message).toBe("Onramped successfully");
//    expect(typeof response.body.balance).toBe("number");
//  });
//
//  it("should return 404 if userId is not found", async () => {
//    const response = await request(app).post("/onramp/inr").send({
//      userId: "invalidUserId",
//      amount: 5000,
//    });
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("User not found");
//  });
//
//  it("should return 400 if userId is not provided", async () => {
//    const response = await request(app).post("/onramp/inr").send({
//      amount: 5000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("User Id is required");
//  });
//
//  it("should return 400 if amount is not provided", async () => {
//    const response = await request(app).post("/onramp/inr").send({
//      userId: "user1",
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Amount is required");
//  });
//});
//
//describe("GET /balance/inr/:userId", () => {
//  it("should return a balance as a number for a given userId", async () => {
//    const userId = "user1";
//    const response = await request(app).get(`/balance/inr/${userId}`);
//    expect(response.status).toBe(200);
//    expect(typeof response.body.balance).toBe("number");
//  });
//
//  it("should return 404 if the user does not exist", async () => {
//    const userId = "invalidUserId";
//    const response = await request(app).get(`/balance/inr/${userId}`);
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("User not found");
//  });
//});
//
//describe("GET /balance/stock/:userId", () => {
//  it("should return the stock balance for a user", async () => {
//    const userId = "user1";
//    const response = await request(app).get(`/balance/stock/${userId}`);
//    expect(response.status).toBe(200);
//    expect(response.body).toHaveProperty("stocks");
//  });
//
//  it("should return 404 if the user does not exist", async () => {
//    const userId = "nonExistentUser";
//    const response = await request(app).get(`/balance/stock/${userId}`);
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("User not found");
//  });
//});

//describe("POST /order/yes", () => {
//   it("1. should place a buy order for options on a stock", async () => {
//     const response = await request(app).post("/order/yes").send({
//       userId: "user1",
//       stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//       quantity: 10,
//       price: 9.5,
//     });
//
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("Buy order placed successfully");
//     expect(response.body.executedPrice).toBe("number");
//     expect(typeof response.body.INRBalance).toBe("number");
//     expect(typeof response.body.stockBalance).toBe("number");
//   });
//
//  it("2. should place a buy order for options on a stock", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 10,
//      price: 9.5,
//    });
//
//    expect(response.status).toBe(200);
//    expect(response.body.message).toBe("Buy order placed successfully");
//    expect(response.body.INRBalance).toBe(405);
//    expect(response.body.stockBalance.yes.quantity).toBe(11);
//    expect(response.body.stockBalance.yes.locked).toBe(0);
//  });
//
//  it("3. should place a buy order for options on a stock", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 3,
//      price: 5,
//    });
//
//    expect(response.status).toBe(200);
//    expect(response.body.message).toBe("Buy order placed successfully");
//    expect(response.body.INRBalance).toBe(390);
//    expect(response.body.stockBalance.yes.quantity).toBe(14);
//    expect(response.body.stockBalance.yes.locked).toBe(0);
//  });
//
//  it("should return 400 if insufficient INR balance", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 1000000,
//      price: 1000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Insufficient INR balance");
//  });
//
//  //also need to add a test case to check whether the number of stocks that the user is trying to buy are available or not ?
//
//  it("should return 400 if userId is not provided", async () => {
//    const response = await request(app).post("/order/yes").send({
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 10,
//      price: 1000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("UserId is required");
//  });
//
//  it("should return 400 if stockSymbol is not provided", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      quantity: 10,
//      price: 1000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Stock symbol is required");
//  });
//
//  it("should return 400 if quantity is not provided", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      price: 1000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Quantity is required");
//  });
//
//  it("should return 400 if price is not provided", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 10,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Price is required");
//  });
//
//  it("should return 404 if userId is not found", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "invalidUserId",
//      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
//      quantity: 10,
//      price: 1000,
//    });
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("User not found");
//  });
//
//  it("should return 400 if stockSymbol is invalid", async () => {
//    const response = await request(app).post("/order/yes").send({
//      userId: "user1",
//      stockSymbol: "invalidStockSymbol",
//      quantity: 10,
//      price: 1000,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Invalid stock symbol");
//  });
//});

//describe("POST /order/no", () => {
//  it("should place a sell order for options on a stock", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      stockSymbol: "ABC",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(200);
//    expect(response.body.message).toBe("Sell order placed successfully");
//  });
//
//  it("should return 400 if user does not own the stock", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      stockSymbol: "NON_EXISTENT_STOCK",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Stock not owned by user");
//  });
//
//  it("should return 400 if userId is not provided", async () => {
//    const response = await request(app).post("/order/no").send({
//      stockSymbol: "ABC",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("UserId is required");
//  });
//
//  it("should return 400 if stockSymbol is not provided", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Stock symbol is required");
//  });
//
//  it("should return 400 if quantity is not provided", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      stockSymbol: "ABC",
//      price: 1100,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Quantity is required");
//  });
//
//  it("should return 400 if price is not provided", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      stockSymbol: "ABC",
//      quantity: 5,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Price is required");
//  });
//
//  it("should return 404 if userId is not found", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "invalidUserId",
//      stockSymbol: "ABC",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("User not found");
//  });
//
//  it("should return 400 if stockSymbol is invalid", async () => {
//    const response = await request(app).post("/order/no").send({
//      userId: "user2",
//      stockSymbol: "INVALID_STOCK_SYMBOL",
//      quantity: 5,
//      price: 1100,
//    });
//    expect(response.status).toBe(400);
//    expect(response.body.message).toBe("Invalid stock symbol");
//  });
//});
//
//describe("GET /orderbook/:stockSymbol", () => {
//  it("should return the current yes and no orders for a given stock", async () => {
//    const stockSymbol = "BTC_USDT_10_Oct_2024_9_30";
//    const response = await request(app).get(`/orderbook/${stockSymbol}`);
//    expect(response.status).toBe(200);
//    expect(response.body).toHaveProperty("yes");
//    expect(response.body).toHaveProperty("no");
//  });
//
//  it("should return 404 if the stock symbol does not exist", async () => {
//    const stockSymbol = "NON_EXISTENT_STOCK";
//    const response = await request(app).get(`/orderbook/${stockSymbol}`);
//    expect(response.status).toBe(404);
//    expect(response.body.message).toBe("Stock symbol not found");
//  });
//});

describe("E-to-E-1", () => {
  beforeAll(async () => {
    // Reset in-memory data structures via an API endpoint or directly if available
    // Assuming you have an endpoint to reset the data structures for testing purposes
    await request(app).post("/reset"); // Implement this endpoint in your app for testing
  });

  it("should execute the user creation, symbol creation, minting, selling, and buying the stocks", async () => {
    // Step 1: Create a new user (User1)
    let response = await request(app).get("/user/create/user1");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user1 created.");

    // Fetch INR_BALANCES after creating User1
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user1");
    expect(response.body["user1"]).toEqual({ balance: 0, locked: 0 });

    // Step 2: Create a new symbol
    response = await request(app).get(
      "/symbol/create/BTC_USDT_10_Oct_2024_9_30",
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Symbol BTC_USDT_10_Oct_2024_9_30 created.",
    );

    // Fetch ORDERBOOK after creating symbol
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("BTC_USDT_10_Oct_2024_9_30");
    expect(response.body["BTC_USDT_10_Oct_2024_9_30"]).toEqual({
      yes: {},
      no: {},
    });

    // Step 3: Mint some quantities to the created user (User1)
    response = await request(app)
      .post("/trade/mint/BTC_USDT_10_Oct_2024_9_30")
      .send({
        userId: "user1",
        quantity: 100,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 100 'yes' and 'no' tokens for user user1.",
    );

    // Fetch STOCK_BALANCES after minting
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user1");
    expect(response.body["user1"]).toHaveProperty("BTC_USDT_10_Oct_2024_9_30");
    expect(response.body["user1"]["BTC_USDT_10_Oct_2024_9_30"]).toEqual({
      yes: { quantity: 100, locked: 0 },
      no: { quantity: 100, locked: 0 },
    });

    // Step 4: User1 sells some quantities of "no"
    response = await request(app).post("/order/sell/no").send({
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 50,
      price: 1000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 50 'no' options at price 1000.",
    );

    // Fetch STOCK_BALANCES after placing sell order
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    expect(response.body["user1"]["BTC_USDT_10_Oct_2024_9_30"]["no"]).toEqual({
      quantity: 50, // 100 - 50
      locked: 50, // Locked 50 units
    });

    // Fetch ORDERBOOK after User1's sell order
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    const orderbook = response.body;
    expect(orderbook).toHaveProperty("BTC_USDT_10_Oct_2024_9_30");
    expect(orderbook["BTC_USDT_10_Oct_2024_9_30"]["no"]).toHaveProperty("1000");
    expect(orderbook["BTC_USDT_10_Oct_2024_9_30"]["no"]["1000"]).toEqual({
      total: 50,
      orders: {
        user1: 50,
      },
    });

    // Step 5: Create a second user (User2)
    response = await request(app).get("/user/create/user2");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User user2 created.");

    // Fetch INR_BALANCES after creating User2
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user2");
    expect(response.body["user2"]).toEqual({ balance: 0, locked: 0 });

    // Step 6: User2 uses the onramp route to get some INR balance
    response = await request(app).post("/onramp/inr").send({
      userId: "user2",
      amount: 200000, // Amount in paise (₹2000.00)
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped successfully");

    // Fetch INR_BALANCES after onramping
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    expect(response.body["user2"]).toEqual({
      balance: 200000,
      locked: 0,
    });

    // Step 7: User2 buys some quantities of "no" from the order book
    response = await request(app).post("/order/buy/no").send({
      userId: "user2",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 50,
      price: 1000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed.");

    // Fetch INR_BALANCES after trade execution
    response = await request(app).get("/balances/inr");
    expect(response.status).toBe(200);
    const inrBalances = response.body;
    expect(inrBalances["user2"]).toEqual({
      balance: 150000, // 200000 - (50 * 1000)
      locked: 0,
    });
    expect(inrBalances["user1"]).toEqual({
      balance: 50000, // 0 + (50 * 1000)
      locked: 0,
    });

    // Fetch STOCK_BALANCES after trade execution
    response = await request(app).get("/balances/stock");
    expect(response.status).toBe(200);
    const stockBalances = response.body;

    expect(stockBalances["user2"]).toHaveProperty("BTC_USDT_10_Oct_2024_9_30");
    expect(stockBalances["user2"]["BTC_USDT_10_Oct_2024_9_30"]).toHaveProperty(
      "no",
    );
    expect(stockBalances["user2"]["BTC_USDT_10_Oct_2024_9_30"]["no"]).toEqual({
      quantity: 50,
      locked: 0,
    });

    expect(stockBalances["user1"]["BTC_USDT_10_Oct_2024_9_30"]["no"]).toEqual({
      quantity: 50, // Remaining after selling 50 units
      locked: 0, // Locked units have been sold
    });

    // Fetch ORDERBOOK after trade execution
    response = await request(app).get("/orderbook");
    expect(response.status).toBe(200);
    const updatedOrderbook = response.body;

    // Check that the orderbook no longer has the sell order
    expect(
      updatedOrderbook["BTC_USDT_10_Oct_2024_9_30"]["no"],
    ).not.toHaveProperty("1000");
  });
});

describe("E-to-E-2", () => {
  beforeAll(() => {
    // Reset in-memory data structures before the test suite runs
    INR_BALANCES = {};
    STOCK_BALANCES = {};
    ORDERBOOK = {};
  });

  it("should execute the user creation , symbol creation , minting  , selling and buying the stocks", async () => {
    // Step 1: Create a new user (UserA)
    let response = await request(app).get("/user/create/userA");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User userA created.");

    // Check INR_BALANCES after creating UserA
    expect(INR_BALANCES).toHaveProperty("userA");
    expect(INR_BALANCES["userA"]).toEqual({ balance: 0, locked: 0 });

    // Step 2: Create a new symbol
    response = await request(app).get("/symbol/create/XYZ");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Symbol XYZ created.");

    // Check ORDERBOOK after creating symbol
    expect(ORDERBOOK).toHaveProperty("XYZ");
    expect(ORDERBOOK["XYZ"]).toEqual({ yes: {}, no: {} });

    // Step 3: Mint some quantities to the created user (UserA)
    response = await request(app).post("/trade/mint/XYZ").send({
      userId: "userA",
      quantity: 200,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Minted 200 'yes' and 'no' tokens for user userA.",
    );

    // Verify STOCK_BALANCES for UserA after minting
    expect(STOCK_BALANCES).toHaveProperty("userA");
    expect(STOCK_BALANCES["userA"]).toHaveProperty("XYZ");
    expect(STOCK_BALANCES["userA"]["XYZ"]).toEqual({
      yes: { quantity: 200, locked: 0 },
      no: { quantity: 200, locked: 0 },
    });

    // Step 4: UserA sells some quantities of "yes"
    response = await request(app).post("/order/sell/yes").send({
      userId: "userA",
      stockSymbol: "XYZ",
      quantity: 150,
      price: 1200,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sell order placed for 150 'yes' options at price 1200.",
    );

    // Verify STOCK_BALANCES for UserA after placing sell order
    expect(STOCK_BALANCES["userA"]["XYZ"]["yes"]).toEqual({
      quantity: 50, // 200 - 150
      locked: 150, // Locked 150 units
    });

    // Verify ORDERBOOK after UserA's sell order
    expect(ORDERBOOK["XYZ"]["yes"]).toHaveProperty("1200");
    expect(ORDERBOOK["XYZ"]["yes"]["1200"]).toEqual({
      total: 150,
      orders: {
        userA: 150,
      },
    });

    // Step 5: Create a second user (UserB)
    response = await request(app).get("/user/create/userB");
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User userB created.");

    // Check INR_BALANCES after creating UserB
    expect(INR_BALANCES).toHaveProperty("userB");
    expect(INR_BALANCES["userB"]).toEqual({ balance: 0, locked: 0 });

    // Step 6: UserB uses the onramp route to get some INR balance
    response = await request(app).post("/onramp/inr").send({
      userId: "userB",
      amount: 500000, // Amount in paise (₹5000.00)
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped successfully");

    // Verify INR_BALANCES for UserB after onramping
    expect(INR_BALANCES["userB"]).toEqual({
      balance: 500000,
      locked: 0,
    });

    // Step 7: UserB buys some quantities of "yes" from the order book
    response = await request(app).post("/order/buy/yes").send({
      userId: "userB",
      stockSymbol: "XYZ",
      quantity: 150,
      price: 1200,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed and trade executed.");

    // Verify INR_BALANCES after trade execution
    expect(INR_BALANCES["userB"]).toEqual({
      balance: 320000, // 500000 - (150 * 1200)
      locked: 0,
    });
    expect(INR_BALANCES["userA"]).toEqual({
      balance: 180000, // 0 + (150 * 1200)
      locked: 0,
    });

    // Verify STOCK_BALANCES after trade execution
    expect(STOCK_BALANCES["userB"]).toHaveProperty("XYZ");
    expect(STOCK_BALANCES["userB"]["XYZ"]).toHaveProperty("yes");
    expect(STOCK_BALANCES["userB"]["XYZ"]["yes"]).toEqual({
      quantity: 150,
      locked: 0,
    });

    expect(STOCK_BALANCES["userA"]["XYZ"]["yes"]).toEqual({
      quantity: 50, // Remaining after selling 150 units
      locked: 0, // Locked units have been sold
    });

    // The total should be zero or the price level should be removed if no orders remain
    expect(ORDERBOOK["XYZ"]["yes"]).not.toHaveProperty("1200");
  });
});

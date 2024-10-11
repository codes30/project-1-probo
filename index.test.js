const request = require("supertest");
const app = require("./index");

describe("POST /onramp/inr", () => {
  it("should add INR to the user's balance", async () => {
    const response = await request(app).post("/onramp/inr").send({
      userId: "user1",
      amount: 10000,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Onramped successfully");
    expect(typeof response.body.balance).toBe("number");
  });

  it("should return 404 if userId is not found", async () => {
    const response = await request(app).post("/onramp/inr").send({
      userId: "invalidUserId",
      amount: 5000,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 400 if userId is not provided", async () => {
    const response = await request(app).post("/onramp/inr").send({
      amount: 5000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User Id is required");
  });

  it("should return 400 if amount is not provided", async () => {
    const response = await request(app).post("/onramp/inr").send({
      userId: "user1",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Amount is required");
  });
});

describe("GET /balance/inr/:userId", () => {
  it("should return a balance as a number for a given userId", async () => {
    const userId = "user1";
    const response = await request(app).get(`/balance/inr/${userId}`);
    expect(response.status).toBe(200);
    expect(typeof response.body.balance).toBe("number");
  });

  it("should return 404 if the user does not exist", async () => {
    const userId = "invalidUserId";
    const response = await request(app).get(`/balance/inr/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

describe("GET /balance/stock/:userId", () => {
  it("should return the stock balance for a user", async () => {
    const userId = "user1";
    const response = await request(app).get(`/balance/stock/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("stocks");
  });

  it("should return 404 if the user does not exist", async () => {
    const userId = "nonExistentUser";
    const response = await request(app).get(`/balance/stock/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

describe("POST /order/yes", () => {
  it("should place a buy order for options on a stock", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 10,
      price: 9.5,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buy order placed successfully");
    expect(response.body.executedPrice).toBe("number");
    expect(typeof response.body.INRBalance).toBe("number");
    expect(typeof response.body.stockBalance).toBe("number");
  });

  it("should return 400 if insufficient INR balance", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 1000000,
      price: 1000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient INR balance");
  });

  //also need to add a test case to check whether the number of stocks that the user is trying to buy are available or not ?

  it("should return 400 if userId is not provided", async () => {
    const response = await request(app).post("/order/yes").send({
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 10,
      price: 1000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("UserId is required");
  });

  it("should return 400 if stockSymbol is not provided", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      quantity: 10,
      price: 1000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Stock symbol is required");
  });

  it("should return 400 if quantity is not provided", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      price: 1000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Quantity is required");
  });

  it("should return 400 if price is not provided", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 10,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Price is required");
  });

  it("should return 404 if userId is not found", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "invalidUserId",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: 10,
      price: 1000,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 400 if stockSymbol is invalid", async () => {
    const response = await request(app).post("/order/yes").send({
      userId: "user1",
      stockSymbol: "invalidStockSymbol",
      quantity: 10,
      price: 1000,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid stock symbol");
  });
});

describe("POST /order/no", () => {
  it("should place a sell order for options on a stock", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      stockSymbol: "ABC",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sell order placed successfully");
  });

  it("should return 400 if user does not own the stock", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      stockSymbol: "NON_EXISTENT_STOCK",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Stock not owned by user");
  });

  it("should return 400 if userId is not provided", async () => {
    const response = await request(app).post("/order/no").send({
      stockSymbol: "ABC",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("UserId is required");
  });

  it("should return 400 if stockSymbol is not provided", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Stock symbol is required");
  });

  it("should return 400 if quantity is not provided", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      stockSymbol: "ABC",
      price: 1100,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Quantity is required");
  });

  it("should return 400 if price is not provided", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      stockSymbol: "ABC",
      quantity: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Price is required");
  });

  it("should return 404 if userId is not found", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "invalidUserId",
      stockSymbol: "ABC",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 400 if stockSymbol is invalid", async () => {
    const response = await request(app).post("/order/no").send({
      userId: "user2",
      stockSymbol: "INVALID_STOCK_SYMBOL",
      quantity: 5,
      price: 1100,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid stock symbol");
  });
});

describe("GET /orderbook/:stockSymbol", () => {
  it("should return the current yes and no orders for a given stock", async () => {
    const stockSymbol = "BTC_USDT_10_Oct_2024_9_30";
    const response = await request(app).get(`/orderbook/${stockSymbol}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("yes");
    expect(response.body).toHaveProperty("no");
  });

  it("should return 404 if the stock symbol does not exist", async () => {
    const stockSymbol = "NON_EXISTENT_STOCK";
    const response = await request(app).get(`/orderbook/${stockSymbol}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Stock symbol not found");
  });
});

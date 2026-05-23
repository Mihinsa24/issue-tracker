const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/emailService");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../utils/emailService");

describe("authController", () => {
  let res;

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  // ─── REGISTER ───────────────────────────────────────────

  it("returns 400 when email is already registered", async () => {
    User.findOne.mockResolvedValue({ email: "existing@test.com" });

    await register(
      { body: { name: "Existing", email: "existing@test.com", password: "password" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already registered" });
    expect(User.create).not.toHaveBeenCalled();
  });

  it("registers a new user and sends verification email", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({
      _id: "123",
      name: "New User",
      email: "new@test.com",
    });
    sendVerificationEmail.mockResolvedValue(true);

    await register(
      { body: { name: "New User", email: "new@test.com", password: "password" } },
      res
    );

    expect(sendVerificationEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration successful! Please check your email to verify your account.",
    });
  });

  // ─── LOGIN ───────────────────────────────────────────────

  it("returns 400 when login email does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    await login(
      { body: { email: "notfound@test.com", password: "password" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  it("returns 401 when user is not verified", async () => {
    User.findOne.mockResolvedValue({
      _id: "123",
      email: "test@test.com",
      password: "hashed",
      name: "Test",
      isVerified: false,
    });

    await login(
      { body: { email: "test@test.com", password: "password" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please verify your email before logging in",
    });
  });

  it("returns 400 when password is incorrect", async () => {
    User.findOne.mockResolvedValue({
      _id: "123",
      email: "test@test.com",
      password: "hashed",
      name: "Test",
      isVerified: true,
    });
    bcrypt.compare.mockResolvedValue(false);

    await login(
      { body: { email: "test@test.com", password: "wrongpassword" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  it("returns 200 when login succeeds", async () => {
    const user = {
      _id: "123",
      email: "test@test.com",
      password: "hashed",
      name: "Test",
      isVerified: true,
    };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("signed-token");

    await login(
      { body: { email: "test@test.com", password: "password" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "signed-token",
      user: { id: user._id, name: user.name, email: user.email },
    });
  });
});
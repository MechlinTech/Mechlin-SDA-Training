require("dotenv").config();

const { authService } = require("./middleware/auth");

async function testAuth() {
  try {
    console.log("Testing password validation...");

    await authService.validatePassword("Test@1234");

    console.log("Password validation: PASSED");

    console.log("\nTesting password hashing...");

    const hashedPassword = await authService.hashPassword("Test@1234");

    console.log("Password hashing: PASSED");

    console.log("\nTesting password comparison...");

    const passwordMatch = await authService.comparePassword(
      "Test@1234",
      hashedPassword
    );

    console.log(
      `Password comparison: ${passwordMatch ? "PASSED" : "FAILED"}`
    );

    console.log("\nTesting JWT generation...");

    const user = {
      _id: "123456789",
      email: "test@example.com",
      role: "user",
    };

    const tokens = await authService.generateTokens(user);

    console.log("Access token generated:", !!tokens.accessToken);
    console.log("Refresh token generated:", !!tokens.refreshToken);

    console.log("\nTesting access token verification...");

    const decodedAccessToken = await authService.verifyToken(
      tokens.accessToken
    );

    console.log("Access token verification: PASSED");
    console.log("Decoded user:", decodedAccessToken);

    console.log("\nTesting refresh token verification...");

    const decodedRefreshToken =
      await authService.verifyRefreshToken(tokens.refreshToken);

    console.log("Refresh token verification: PASSED");
    console.log("Refresh token user ID:", decodedRefreshToken.userId);

    console.log("\nAll authentication tests passed!");
  } catch (error) {
    console.error("\nAuthentication test failed:");
    console.error(error.message);

    if (error.details) {
      console.error("Details:", error.details);
    }

    process.exit(1);
  }
}

testAuth();
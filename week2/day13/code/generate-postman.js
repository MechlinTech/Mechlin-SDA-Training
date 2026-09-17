const fs = require("fs");
const path = require("path");
const Converter = require("openapi-to-postmanv2");

const swaggerSpec = require("./docs/openapi");

const outputPath = path.join(
  __dirname,
  "../docs/postman-collection.json"
);

const input = {
  type: "json",
  data: swaggerSpec,
};

Converter.convert(input, {}, (error, result) => {
  if (error) {
    console.error("Postman collection generation failed:", error);
    process.exit(1);
  }

  if (!result.result) {
    console.error("Postman collection generation failed.");
    console.error(result.reason || result);
    process.exit(1);
  }

  const collection = result.output[0].data;

  collection.info = {
    ...collection.info,
    name: "SDA Training API",
    description: "Postman collection for the SDA Training API",
  };

  collection.variable = [
    {
      key: "base_url",
      value: "http://localhost:3000/api/v1",
    },
    {
      key: "jwt_token",
      value: "",
    },
  ];

  fs.writeFileSync(
    outputPath,
    JSON.stringify(collection, null, 2)
  );

  console.log("Postman collection generated successfully.");
  console.log(`Saved to: ${outputPath}`);
});
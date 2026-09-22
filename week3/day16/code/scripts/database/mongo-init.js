db = db.getSiblingDB("sda_training");

db.createCollection("health_checks");

db.health_checks.insertOne({
  service: "mongodb",
  status: "initialized",
  createdAt: new Date()
});

print("MongoDB initialization completed.");
const Task = require("../models/task.model");

const getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user.id,
    });

    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pending = tasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completionRate =
      total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    res.json({
      success: true,
      analytics: {
        total,
        completed,
        pending,
        inProgress,
        completionRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};
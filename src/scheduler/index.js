const { ValidationError } = require('../errors');

function scheduleTask(name, interval, task, log) {
  if (typeof name !== "string" || name.length === 0) {
    throw new ValidationError("Task name must be a non-empty string", { name });
  }

  if (typeof interval !== "number" || interval <= 0) {
    throw new ValidationError("Interval must be a positive number", { interval });
  }

  if (typeof task !== "function") {
    throw new ValidationError("Task must be a function", { taskType: typeof task });
  }

  if (typeof log !== "function") {
    throw new ValidationError("Logger must be a function", { logType: typeof log });
  }
  
  log(`Task "${name}" scheduled every ${interval}ms`);

  return setInterval(() => {
    task();
  }, interval);
}

module.exports = scheduleTask;

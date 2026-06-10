const { ValidationError } = require('../errors');

function scheduleTask(name, interval, task, logger, options = {}) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new ValidationError("Task name must be a non-empty string", { name });
  }

  if (!Number.isFinite(interval) || interval <= 0) {
    throw new ValidationError("Interval must be a positive number", { interval });
  }

  if (typeof task !== "function") {
    throw new ValidationError("Task must be a function", { taskType: typeof task });
  }

  if (
    !logger ||
    typeof logger.info !== 'function' ||
    typeof logger.warn !== 'function' ||
    typeof logger.error !== 'function'
  ) {
    throw new ValidationError('Logger must provide info, warn and error methods');
  }
  
  let isRunning = false;

  async function executeTask() {
    if (isRunning) {
      logger.warn(`Task "${name}" skipped because previous execution is still running`);
      return;
    }

    isRunning = true;

    try {
      await task();
    } catch (error) {
      logger.error(`Task "${name}" failed: ${error.message}`);
    } finally {
      isRunning = false;
    }
  }

  logger.info(`Task "${name}" scheduled every ${interval}ms`);

  const intervalId = setInterval(executeTask, interval);

  if (options.runImmediately) {
    executeTask();
  }

  return intervalId;
}

module.exports = scheduleTask;

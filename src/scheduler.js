const config = require("./config");
const createLogger = require("./logger");

const log = createLogger(config.appName);

log("scheduler.js started");

function scheduleTask(name, interval, task) {
  log(`Task "${name}" scheduled every ${interval}ms`);

  return setInterval(() => {
    task();
  }, interval);
}

scheduleTask("running", config.scheduler.defaultInterval, () => {
  log("running");
});

module.exports = scheduleTask;

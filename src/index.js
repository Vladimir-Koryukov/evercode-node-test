const config = require('./config')
const createLogger = require('./logger')
const scheduleTask = require('./scheduler')

const log = createLogger(config.appName)

log("app started");

scheduleTask("running", config.scheduler.defaultInterval, () => {
  log("running");
}, log);
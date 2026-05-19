function scheduleTask(name, interval, task, log) {
  log(`Task "${name}" scheduled every ${interval}ms`);

  return setInterval(() => {
    task();
  }, interval);
}

module.exports = scheduleTask;

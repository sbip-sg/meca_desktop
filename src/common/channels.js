const Channels = {
  STORE_GET: 'electron-store-get',
  STORE_SET: 'electron-store-set',
  CHECK_DOCKER_DAEMON_RUNNING: 'check-docker-daemon-running',
  CHECK_DOCKER_DAEMON_RUNNING_RESPONSE: 'check-docker-daemon-running-response',
  REMOVE_EXECUTOR_CONTAINER: 'remove-executor-container',
  REMOVE_EXECUTOR_CONTAINER_RESPONSE: 'remove-executor-response',
  RUN_EXECUTOR_CONTAINER_RESPONSE: 'run-executor-container-response',
  RUN_EXECUTOR_GPU_CONTAINER: 'remove-executor-gpu-container',
  RUN_EXECUTOR_GPU_CONTAINER_RESPONSE: 'run-executor-container-gpu-response',
  RUN_EXECUTOR_CONTAINER: 'run-executor-container',
  CHECK_CONTAINER_GPU_SUPPORT: 'check-container-gpu-support',
  CHECK_CONTAINER_GPU_SUPPORT_RESPONSE: 'check-container-gpu-support-response',
  CHECK_CONTAINER_EXIST: 'check-container-exist',
  CHECK_CONTAINER_EXIST_RESPONSE: 'check-container-exist-response',
  APP_CLOSE_INITIATED: 'app-close-initiated',
  APP_CLOSE_CONFIRMED: 'app-close-confirmed',
  APP_RELOAD_INITIATED: 'app-reload-initiated',
  APP_RELOAD_CONFIRMED: 'app-reload-confirmed',
  START_CONSUMER: 'start-consumer',
  STOP_CONSUMER: 'stop-consumer',
  JOB_RECEIVED: 'job-received',
  JOB_RESULTS_RECEIVED: 'job-results-received',
  REGISTER_CLIENT: 'register-client',
  CLIENT_REGISTERED: 'client-registered',
  DEREGISTER_CLIENT: 'deregister-client',
  OFFLOAD_JOB: 'offload-job',
};

export default Channels;

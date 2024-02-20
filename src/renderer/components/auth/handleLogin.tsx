const handleLogin = async (password: string): Promise<boolean> => {
  const did = window.electron.store.get('did');
  if (!did) {
    throw new Error("No account detected on this device!")
  }
  const isCorrectPassword = window.electron.store.equals('password', password);
  if (!isCorrectPassword) {
    return false;
  }
  try {
    await startExecutor('meca_executor_test');
  } catch (executorError) {
    console.error('Error starting executor:', executorError);
    throw executorError;
  }
  return true; // should only return true if signed VP is verified
};

const startExecutor = async (containerName: string) => {
  const dockerDaemonIsRunning =
    await window.electron.checkDockerDaemonRunning();
  if (!dockerDaemonIsRunning) {
    throw new Error('Docker daemon is not running');
  }
  const containerExist = await window.electron.checkContainerExist(
    containerName
  );
  if (containerExist) {
    const hasGpuSupport = await window.electron.checkContainerGpuSupport(
      containerName
    );
    if (hasGpuSupport) {
      await window.electron.removeExecutorContainer(containerName);
    }
  }
  await window.electron.runExecutorContainer(containerName);
};

export default handleLogin;

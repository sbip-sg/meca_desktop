import * as Yup from 'yup';

export const ActivateFormSchema = (minStake: number) =>
  Yup.object({
    stake: Yup.number()
      .required('Stake required!')
      .min(minStake, `Stake must be more than the minimum of ${minStake}!`)
      .max(1000000, 'Stake too high!'),
    blockTimeoutLimit: Yup.number()
      .required('Block timeout limit required!')
      .min(1, 'Block timeout limit too low!')
      .max(1000000, 'Block timeout limit too high!'),
  });

export const InitialLoginFormValues: LoginFormValues = {
  TASK_EXECUTOR_HOST:
    process.env.TASK_EXECUTOR_HOST ||
    window.electron.store.get('TASK_EXECUTOR_HOST') ||
    '',
  TASK_EXECUTOR_PORT:
    Number(process.env.TASK_EXECUTOR_PORT) ||
    window.electron.store.get('TASK_EXECUTOR_PORT') ||
    0,
  PYMECA_ACTOR_SERVER_HOST:
    process.env.PYMECA_ACTOR_SERVER_HOST ||
    window.electron.store.get('PYMECA_ACTOR_SERVER_HOST') ||
    '',
  PYMECA_ACTOR_SERVER_PORT:
    Number(process.env.PYMECA_ACTOR_SERVER_PORT) ||
    window.electron.store.get('PYMECA_ACTOR_SERVER_PORT') ||
    0,
  IPFS_NODE_URL:
    process.env.IPFS_NODE_URL ||
    window.electron.store.get('IPFS_NODE_URL') ||
    '',
  MECA_BLOCKCHAIN_RPC_URL:
    process.env.MECA_BLOCKCHAIN_RPC_URL ||
    window.electron.store.get('MECA_BLOCKCHAIN_RPC_URL') ||
    '',
  MECA_TASK_EXECUTOR_URL:
    process.env.MECA_TASK_EXECUTOR_URL ||
    window.electron.store.get('MECA_TASK_EXECUTOR_URL') ||
    '',
  MECA_IPFS_HOST:
    process.env.MECA_IPFS_HOST ||
    window.electron.store.get('MECA_IPFS_HOST') ||
    '',
  MECA_IPFS_PORT:
    Number(process.env.MECA_IPFS_PORT) ||
    window.electron.store.get('MECA_IPFS_PORT') ||
    0,
  MECA_HOST_PRIVATE_KEY:
    process.env.MECA_HOST_PRIVATE_KEY ||
    window.electron.store.get('MECA_HOST_PRIVATE_KEY') ||
    '',
  MECA_HOST_ENCRYPTION_PRIVATE_KEY:
    process.env.MECA_HOST_ENCRYPTION_PRIVATE_KEY ||
    window.electron.store.get('MECA_HOST_ENCRYPTION_PRIVATE_KEY') ||
    '',
  MECA_IPFS_API_HOST:
    process.env.MECA_IPFS_API_HOST ||
    window.electron.store.get('MECA_IPFS_API_HOST') ||
    '',
  MECA_IPFS_API_PORT:
    Number(process.env.MECA_IPFS_API_PORT) ||
    window.electron.store.get('MECA_IPFS_API_PORT') ||
    0,
  MECA_DEV_PRIVATE_KEY:
    process.env.MECA_DEV_PRIVATE_KEY ||
    window.electron.store.get('MECA_DEV_PRIVATE_KEY') ||
    '',
  MECA_USER_PRIVATE_KEY:
    process.env.MECA_USER_PRIVATE_KEY ||
    window.electron.store.get('MECA_USER_PRIVATE_KEY') ||
    '',
  MECA_TOWER_PRIVATE_KEY:
    process.env.MECA_TOWER_PRIVATE_KEY ||
    window.electron.store.get('MECA_TOWER_PRIVATE_KEY') ||
    '',
  MECA_DAO_CONTRACT_ADDRESS:
    process.env.MECA_DAO_CONTRACT_ADDRESS ||
    window.electron.store.get('MECA_DAO_CONTRACT_ADDRESS') ||
    '',
};

export interface LoginFormValues {
  TASK_EXECUTOR_HOST: string;
  TASK_EXECUTOR_PORT: number;
  PYMECA_ACTOR_SERVER_HOST: string;
  PYMECA_ACTOR_SERVER_PORT: number;
  IPFS_NODE_URL: string;
  MECA_BLOCKCHAIN_RPC_URL: string;
  MECA_TASK_EXECUTOR_URL: string;
  MECA_DAO_CONTRACT_ADDRESS: string;
  // host
  MECA_IPFS_HOST: string;
  MECA_IPFS_PORT: number;
  MECA_HOST_PRIVATE_KEY: string;
  MECA_HOST_ENCRYPTION_PRIVATE_KEY: string;
  // Task developer
  MECA_IPFS_API_HOST: string;
  MECA_IPFS_API_PORT: number;
  MECA_DEV_PRIVATE_KEY: string;
  // User
  MECA_USER_PRIVATE_KEY: string;
  // Tower
  MECA_TOWER_PRIVATE_KEY: string;
}

export const LoginFormSchema = Yup.object({
  TASK_EXECUTOR_HOST: Yup.string()
    .required('Task executor host required!')
    .default('http://localhost'),
  TASK_EXECUTOR_PORT: Yup.number()
    .required('Task executor port required!')
    .default(2591),
  PYMECA_ACTOR_SERVER_HOST: Yup.string()
    .required('Pymeca actor server host required!')
    .default('http://localhost'),
  PYMECA_ACTOR_SERVER_PORT: Yup.number()
    .required('Pymeca actor server port required!')
    .default(9999),
  IPFS_NODE_URL: Yup.string()
    .required('IPFS node URL required!')
    .default('http://localhost:5001'),
  MECA_BLOCKCHAIN_RPC_URL: Yup.string()
    .required('Blockchain RPC URL required!')
    .default('http://host.docker.internal:9000'),
  MECA_TASK_EXECUTOR_URL: Yup.string()
    .required('Task executor URL required!')
    .default('http://meca-executor-1:2591'),
  MECA_DAO_CONTRACT_ADDRESS: Yup.string(),
  // host
  MECA_IPFS_HOST: Yup.string()
    .required('IPFS host required!')
    .default('host.docker.internal'),
  MECA_IPFS_PORT: Yup.number().required('IPFS port required!').default(8080),
  MECA_HOST_PRIVATE_KEY: Yup.string().required('Host private key required!'),
  MECA_HOST_ENCRYPTION_PRIVATE_KEY: Yup.string().required(
    'Host encryption private key required!'
  ),
  // Task developer
  MECA_IPFS_API_HOST: Yup.string().default('host.docker.internal'),
  MECA_IPFS_API_PORT: Yup.number().default(5001),
  MECA_DEV_PRIVATE_KEY: Yup.string(),
  // User
  MECA_USER_PRIVATE_KEY: Yup.string(),
  // Tower
  MECA_TOWER_PRIVATE_KEY: Yup.string(),
});

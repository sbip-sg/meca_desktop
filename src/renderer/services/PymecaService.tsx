import { ContainerName, ContainerPort } from "common/dockerNames";

const host = process.env.PYMECA_ACTOR_SERVER_HOST || `http://localhost`;
const port = process.env.PYMECA_ACTOR_SERVER_PORT || ContainerPort.PYMECA_SERVER_1_PORT;
const url = `${host}:${port}`;

export async function sendRequest(functionName: string, args: any) {
  const response = await fetch(`${url}/exec/${functionName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response.json();
}

export async function initActor(actorName: string) {
  const response = await fetch(`${url}/init_actor/${actorName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response;
}

export async function closeActor() {
  const response = await fetch(`${url}/close_actor`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response;
}

export async function getAccount() {
  const response = await fetch(`${url}/get_account`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response;
}

export async function cid_from_sha256(sha256: string) {
  try {
    const response = await fetch(`${url}/cid_from_sha256/${sha256}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      return response.json().then((data: any) => {
        throw new Error(data.detail);
      });
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get cid from sha256 error:', error.message);
      throw new Error(`Get cid from sha256 error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function waitForTask(
  tower_address: string,
  host_encryption_private_key: string,
  container_name_limit: number,
  resources: any
) {
  try {
    const response = await fetch(`${url}/wait_for_task`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tower_address,
        host_encryption_private_key,
        container_name_limit,
        resources
      }),
    });
    if (!response.ok) {
      return response.json().then((data: any) => {
        throw new Error(data.detail);
      });
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Wait for task error:', error.message);
      throw new Error(`Wait for task error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

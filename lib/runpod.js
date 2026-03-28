const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID;

function getRunpodRunUrl() {
  return `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/run`;
}

function getRunpodStatusUrl(jobId) {
  return `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/status/${jobId}`;
}

async function runpodFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${RUNPOD_API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    throw new Error(`RunPod returned invalid JSON: ${text}`);
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `RunPod request failed (${response.status})`
    );
  }

  return data;
}

export async function submitRenderJob(payload) {
  return runpodFetch(getRunpodRunUrl(), {
    method: "POST",
    body: JSON.stringify({
      input: payload,
      ttl: 1000 * 60 * 60 * 2,
      executionTimeout: 1000 * 60 * 30
    })
  });
}

export async function getRenderJobStatus(jobId) {
  return runpodFetch(getRunpodStatusUrl(jobId), {
    method: "GET"
  });
}
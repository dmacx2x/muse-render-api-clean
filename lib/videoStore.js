const store = new Map();

export function createJob(job) {
  console.log("🟢 SAVING JOB:", job.id);
  store.set(job.id, job);
}

export function updateJob(id, updates) {
  const existing = store.get(id);

  if (!existing) {
    console.log("❌ JOB NOT FOUND:", id);
    return null;
  }

  const updated = {
    ...existing,
    ...updates
  };

  store.set(id, updated);

  console.log("🟡 JOB UPDATED:", id);

  return updated;
}

export function getAllJobs() {
  console.log("📦 ALL JOBS:", Array.from(store.values()));
  return Array.from(store.values());
}
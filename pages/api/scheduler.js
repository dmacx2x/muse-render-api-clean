let workers = [
{ id: "gpu1", url: process.env.WORKER1_URL, busy: false },
{ id: "gpu2", url: process.env.WORKER2_URL, busy: false },
{ id: "gpu3", url: process.env.WORKER3_URL, busy: false }
];

export async function assignRenderJob(job){

const freeWorker = workers.find(w => !w.busy);

if(!freeWorker){
return { status: "queued" };
}

freeWorker.busy = true;

const response = await fetch(freeWorker.url,{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify(job)
});

const data = await response.json();

freeWorker.busy = false;

return data;
}

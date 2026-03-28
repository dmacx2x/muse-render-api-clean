import { useState, useEffect } from "react";

export default function MuseStudio() {

const [title,setTitle] = useState("");
const [prompt,setPrompt] = useState("");
const [videos,setVideos] = useState([]);
const [rendering,setRendering] = useState(false);
const [progress,setProgress] = useState(0);

useEffect(()=>{

const saved = localStorage.getItem("museVideos");

if(saved){
setVideos(JSON.parse(saved));
}

},[]);

function saveVideos(v){
setVideos(v);
localStorage.setItem("museVideos",JSON.stringify(v));
}

async function renderVideo(){

if(!prompt){
alert("Enter a prompt first");
return;
}

setRendering(true);
setProgress(10);

try{

const response = await fetch("/api/render",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title:title,
prompt:prompt
})
});

const data = await response.json();

console.log("Render API response:",data);

if(!data || !data.worker_response || !data.worker_response.id){

alert("Render API did not return a job id");
setRendering(false);
return;

}

pollStatus(data.worker_response.id);

}catch(err){

console.error("Render request failed:",err);
alert("Render request failed");
setRendering(false);

}

}

function pollStatus(id){

const interval=setInterval(async()=>{

try{

const res=await fetch("/api/check-job?id="+id);

const data=await res.json();

console.log("Polling status:",data);

setProgress(p=>Math.min(p+10,90));

if(data.status==="COMPLETED"){

clearInterval(interval);

const videoUrl="data:video/mp4;base64,"+data.video_base64;

const newVideo={
title:title || "Untitled Project",
url:videoUrl,
date:new Date().toLocaleDateString()
};

const updated=[newVideo,...videos];

saveVideos(updated);

setProgress(100);
setRendering(false);

}

}catch(err){

console.error("Polling failed:",err);
clearInterval(interval);
setRendering(false);

}

},3000);

}

return(

<div className="studio">

<div className="builder">

<h2>ATA Muse</h2>

<input
placeholder="Project Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
placeholder="Describe your video"
value={prompt}
onChange={(e)=>setPrompt(e.target.value)}
/>

<button onClick={renderVideo}>
Render Video
</button>

{rendering &&

<div className="progress">
<div className="progress-fill" style={{width:progress+"%"}}></div>
</div>

}

</div>

<div className="library">

<h3>Video Library</h3>

{videos.length===0 && <p>No videos yet</p>}

{videos.map((v,i)=>(

<div key={i} className="video-card">

<h4>{v.title}</h4>
<p>{v.date}</p>

<video controls src={v.url}></video>

<a href={v.url} download>Download</a>

</div>

))}

</div>

</div>

);

}
"use client"

import { useState, useEffect } from "react"
import { speakText, stopSpeaking } from "../../translations/piperTTS"

import en from "../../translations/en.json"
import hi from "../../translations/hi.json"
import mr from "../../translations/mr.json"

const translations = {
  English: en,
  Hindi: hi,
  Marathi: mr
}

const symptoms = [
{
id:1,
emoji:"🤒",
title:"fever"
},
{
id:2,
emoji:"🤕",
title:"headache"
},
{
id:3,
emoji:"🤢",
title:"vomiting"
},
{
id:4,
emoji:"😷",
title:"cough"
},
{
id:5,
emoji:"💧",
title:"diarrhea"
},
{
id:6,
emoji:"👁",
title:"eye"
}
]

const campaigns = [
{
id:1,
title:"Free Medical Camp",
village:"Khed",
date:"20 June",
address:"ZP School Ground"
},
{
id:2,
title:"Eye Checkup Camp",
village:"Shivapur",
date:"25 June",
address:"Community Hall"
},
{
id:3, 
title:"Dental Checkup Camp",
village:"Nagle village",
date:"30 June",
address:"Village Health Center"
},
{id:4,  
  title:"Health Awareness Camp",
  village:"Khed",
  date:"5 July",
  address:"ZP School Ground"
},
{id:5,  
  title:"Free Medical Camp",
  village:"Shivapur",
  date:"10 July",
  address:"Community Hall"
}


]

export default function Blogs(){

const [active,setActive] = useState("awareness")
const [language,setLanguage] = useState("English")
const [search,setSearch] = useState("")
const [selected,setSelected] = useState(null)
const [isSpeaking,setIsSpeaking] = useState(false)

const t = (key)=>{
const keys = key.split(".")
return keys.reduce((obj,i)=>obj[i],translations[language])
}

const handleSpeak = async () => {
if(isSpeaking) {
stopSpeaking();
setIsSpeaking(false);
return;
}

if (!navigator.onLine) {
alert('Audio playback requires internet connection. Please connect to the internet and try again.');
return;
}

setIsSpeaking(true);
try{
const symptomTitle = t(`symptoms.${selected.title}`);
const causesLabel = t("labels.causes");
const adviceLabel = t("labels.advice");
const doctorLabel = t("labels.doctor");

const guidance = t(`guidance.${selected.title}`);
const causesText = guidance.causes.join(". ");
const adviceText = guidance.advice.join(". ");
const doctorText = guidance.doctor.join(". ");

const fullText = `${symptomTitle}. ${causesLabel}: ${causesText}. ${adviceLabel}: ${adviceText}. ${doctorLabel}: ${doctorText}`;

console.log('Speaking:', fullText);
console.log('Language:', language);

await speakText(fullText, language);
}catch(error){
console.error("Speech error:", error);
if(error.message && error.message.includes('internet')){
console.log('Offline mode - TTS not available');
}
}finally{
setIsSpeaking(false);
}
}

const filtered = symptoms.filter(item =>
t(`symptoms.${item.title}`).toLowerCase().includes(search.toLowerCase())
)

return(

<div className="flex min-h-screen bg-gray-100 text-black">

{/* SIDEBAR */}

<div className="w-64 bg-teal-900 text-white p-6">

<h2 className="text-2xl font-bold mb-10">
Health Platform
</h2>

<ul className="space-y-5 text-lg">

<li onClick={()=>setActive("awareness")} className="cursor-pointer">
🏥 Healthcare Guidance
</li>

<li onClick={()=>setActive("consultation")} className="cursor-pointer">
👨‍⚕️ Doctor Consultation
</li>

<li onClick={()=>setActive("ngo")} className="cursor-pointer">
🤝 NGO Campaigns
</li>

</ul>

</div>

{/* MAIN */}

<div className="flex-1 p-10">

{active==="awareness" &&(

<div>

<h1 className="text-3xl font-bold mb-6">
Healthcare Awareness
</h1>

<div className="flex gap-4 mb-8">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder={t("labels.search")}
className="border px-4 py-2 rounded-lg w-72 text-black"
/>

<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
className="border px-4 py-2 rounded-lg text-black"
>
<option>English</option>
<option>Hindi</option>
<option>Marathi</option>
</select>

</div>

<div className="grid md:grid-cols-3 gap-6">

{filtered.map(item=>(

<div
key={item.id}
onClick={()=>setSelected(item)}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg border"
>

<div className="text-3xl mb-2">
{item.emoji}
</div>

<h3 className="text-xl font-bold">
{t(`symptoms.${item.title}`)}
</h3>

</div>

))}

</div>

</div>

)}

{active==="consultation" &&(

<div>

<h1 className="text-3xl font-bold mb-6">
Doctor Consultation
</h1>

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-red-200 p-6 rounded-xl border">
<h3 className="text-xl font-bold">🚑 Emergency</h3>
<p>Toll Free: 108</p>

<a href="tel:108" className="bg-red-600 text-white px-4 py-2 rounded mt-2 inline-block">
Call Now
</a>

</div>

<div className="bg-white p-6 rounded-xl shadow border">
<h3 className="font-bold">🏥 Primary Health Center</h3>
<p>Village: Khed</p>
<p>Phone: 9876543210</p>
</div>
<div className="bg-white p-6 rounded-xl shadow border">
<h3 className="font-bold">🏥 Primary Health Center</h3>
<p>Village: Shivpur</p>
<p>Phone: 9876543210</p>
</div>
<div className="bg-white p-6 rounded-xl shadow border">
<h3 className="font-bold">🏥 Primary Health Center</h3>
<p>Village: Nagle village</p>
<p>Phone: 9876543210</p>
</div>

</div>

</div>

)}

{active==="ngo" &&(

<div>

<h1 className="text-3xl font-bold mb-6">
NGO Campaigns
</h1>

<div className="grid md:grid-cols-2 gap-6">

{campaigns.map(camp=>(

<div key={camp.id} className="bg-white p-6 rounded-xl shadow border">

<h3 className="font-bold text-lg">
{camp.title}
</h3>

<p>Village: {camp.village}</p>
<p>Address: {camp.address}</p>
<p>Date: {camp.date}</p>

</div>

))}

</div>

</div>

)}

</div>

{/* POPUP */}

{selected &&(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-10 rounded-xl w-[650px] max-h-[80vh] overflow-y-auto relative text-black shadow-2xl">

<button
onClick={()=>setSelected(null)}
className="absolute top-4 right-5 text-2xl font-bold"
>
✖
</button>

<button
onClick={handleSpeak}
className="absolute top-4 right-16 text-2xl font-bold hover:scale-110 transition-transform"
title={isSpeaking ? "Stop audio" : "Play audio"}
>
{isSpeaking ? "⏹" : "🔊"}
</button>

<h2 className="text-2xl font-bold mb-4">
{selected.emoji} {t(`symptoms.${selected.title}`)}
</h2>

<h3 className="font-bold text-lg">
{t("labels.causes")}
</h3>

<ul className="list-disc ml-6 mb-4">
{t(`guidance.${selected.title}`).causes.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

<h3 className="font-bold text-green-700 text-lg">
{t("labels.advice")}
</h3>

<ul className="list-disc ml-6 mb-4">
{t(`guidance.${selected.title}`).advice.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

<h3 className="font-bold text-red-700 text-lg">
{t("labels.doctor")}
</h3>

<ul className="list-disc ml-6">
{t(`guidance.${selected.title}`).doctor.map((c,i)=>(
<li key={i}>{c}</li>
))}
</ul>

</div>

</div>

)}

</div>

)

}
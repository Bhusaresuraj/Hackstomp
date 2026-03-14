
"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"



const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 }
  }
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 }
  }
}



export default function Home() {

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -80])

  return (
    <main>

{/* HERO SECTION */}

<section className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-teal-500 to-green-400 text-white min-h-screen px-8">

<header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between pt-6">
<Link
href="/"
className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md transition hover:bg-white/15"
>
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-600 shadow-lg">
<span className="text-lg font-bold">S</span>
</div>
<div>
<p className="text-sm font-semibold tracking-[0.24em] text-white/70">SEVA SWASTHYA</p>
<p className="text-base font-semibold text-white">Rural Health Network</p>
</div>
</Link>

<nav className="hidden items-center gap-8 rounded-full border border-white/15 bg-black/10 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-md md:flex">
<a href="#features" className="transition hover:text-white">Features</a>
<a href="#how-it-works" className="transition hover:text-white">How It Works</a>
<a href="#impact" className="transition hover:text-white">Impact</a>
<a href="#blogs" className="transition hover:text-white">Blogs</a>
</nav>

<Link
href="/login"
className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-teal-700 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-teal-50"
>
Login
<span className="text-base">→</span>
</Link>
</header>

{/* floating medical icons */}

<motion.div
animate={{ y:[0,-20,0] }}
transition={{ duration:4, repeat:Infinity }}
className="absolute text-4xl opacity-20 left-16 top-24"
>
🩺
</motion.div>

<motion.div
animate={{ y:[0,-25,0] }}
transition={{ duration:5, repeat:Infinity }}
className="absolute text-4xl opacity-20 right-20 top-40"
>
❤️
</motion.div>

<motion.div
animate={{ y:[0,-18,0] }}
transition={{ duration:6, repeat:Infinity }}
className="absolute text-4xl opacity-20 right-40 bottom-28"
>
💊
</motion.div>



<div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-20 pb-24 pt-14 md:grid-cols-2">

{/* TEXT */}

<motion.div
initial={{ opacity:0, y:40 }}
animate={{ opacity:1, y:0 }}
transition={{ duration:0.8 }}
>

<h1 className="text-5xl md:text-6xl font-bold leading-tight">
Connecting Rural Communities
<br />
to Healthcare
</h1>

<p className="mt-6 text-lg text-gray-100 max-w-xl">
A collaborative platform connecting doctors, NGOs,
health workers and donors to improve healthcare
awareness and village development.
</p>

<div className="mt-8 flex gap-4">

<Link
href="/login"
className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
>
Explore Doctors
</Link>

<Link
href="/Blogs"
className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition"
>
Read Health Blogs
</Link>

</div>

</motion.div>



{/* IMAGE */}

<motion.div
whileHover={{ scale:1.05 }}
transition={{ duration:0.4 }}
className="relative rounded-2xl shadow-2xl"
>

<Image
src="/landingpage.png"
alt="rural healthcare"
width={650}
height={420}
priority
className="rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
/>

</motion.div>

</div>



{/* curved bottom divider */}

<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">

<svg
className="relative block w-full h-[90px]"
viewBox="0 0 1440 320"
preserveAspectRatio="none"
>

<path
fill="#f9fafb"
fillOpacity="1"
d="M0,192L60,186.7C120,181,240,171,360,165.3C480,160,600,160,720,170.7C840,181,960,203,1080,202.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L0,320Z"
/>

</svg>

</div>

</section>



{/* FEATURES */}

<section id="features" className="py-24 bg-gray-50 px-8">

<motion.h2
variants={fadeUp}
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
className="text-4xl font-bold text-center text-gray-800 mb-16"
>
What Our Platform Provides
</motion.h2>

<motion.div
variants={container}
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
>

<Feature icon="🩺" title="Healthcare Awareness" desc="Doctors share simple health guidance and blogs for rural communities." />
<Feature icon="🤝" title="NGO Collaboration" desc="NGOs organize medical camps, sanitation drives and community programs." />
<Feature icon="🚩" title="Village Issue Reporting" desc="Health workers report sanitation, waste and water issues." />
<Feature icon="💰" title="Donation Transparency" desc="Donors can support rural initiatives and track impact." />
<Feature icon="📚" title="Doctor Knowledge Hub" desc="Doctors publish educational health content and guidance." />
<Feature icon="📊" title="Community Health Insights" desc="NGOs analyze trends and improve rural healthcare planning." />

</motion.div>

</section>



{/* HOW IT WORKS */}

<section id="how-it-works" className="relative py-28 px-8 bg-black text-white overflow-hidden">

<div className="absolute w-[500px] h-[500px] bg-teal-500/20 blur-[150px] top-20 left-20"></div>
<div className="absolute w-[500px] h-[500px] bg-green-400/20 blur-[150px] bottom-10 right-10"></div>

<motion.h2
variants={fadeUp}
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
className="text-4xl font-bold text-center mb-20"
>
How It Works
</motion.h2>

<div className="relative max-w-4xl mx-auto">

<div className="absolute left-5 top-0 h-full w-[3px] bg-gradient-to-b from-teal-400 to-green-400 opacity-60"></div>

<div className="space-y-14">

<Step step="1" text="Villagers access healthcare guidance and awareness content." delay={0}/>
<Step step="2" text="Health workers report sanitation and village issues." delay={0.1}/>
<Step step="3" text="Doctors provide blogs, knowledge and support NGOs." delay={0.2}/>
<Step step="4" text="NGOs organize medical camps and development drives." delay={0.3}/>
<Step step="5" text="Donors support impactful rural initiatives." delay={0.4}/>

</div>

</div>

</section>



{/* IMPACT */}

<section id="impact" className="bg-teal-600 text-white py-20 px-8">

<div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-10">

<Counter end={120} label="Villages Connected" />
<Counter end={80} label="Doctors Participating" />
<Counter end={35} label="NGOs Registered" />
<Counter end={1500} label="Villagers Helped" />

</div>

</section>



{/* BLOG */}

<section id="blogs" className="relative py-28 px-8 bg-gray-50 overflow-hidden">

<div className="absolute w-[350px] h-[350px] bg-teal-300/20 blur-[120px] top-10 left-10"></div>
<div className="absolute w-[350px] h-[350px] bg-green-300/20 blur-[120px] bottom-10 right-10"></div>

<motion.h2
variants={fadeUp}
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
className="text-4xl font-bold text-center text-gray-800 mb-16"
>
Health Awareness Blogs
</motion.h2>

<div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

<Blog
title="Preventing Dengue in Rural Areas"
image="/dengue.png"
/>

<Blog
title="Importance of Clean Drinking Water"
image="/water.jpg"
/>

<Blog
title="Nutrition Tips for Rural Families"
image="/nuitritions.jpg"
/>

</div>

<div className="flex justify-center mt-16">

<Link
href="/blogs"
className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
>
View All Blogs
</Link>

</div>

</section>



{/* FOOTER */}

<footer className="bg-gray-900 text-white py-12 px-8">

<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

<div>
<h3 className="text-xl font-bold">RuralHealthConnect</h3>

<p className="mt-4 text-gray-400">
Connecting rural communities with healthcare professionals,
NGOs and donors to improve village wellbeing.
</p>
</div>

<div>
<h4 className="font-semibold mb-3">Platform</h4>

<ul className="space-y-2 text-gray-400">
<li><Link href="/doctors">Doctors</Link></li>
<li><Link href="/ngos">NGOs</Link></li>
<li><Link href="/workers">Workers</Link></li>
<li><Link href="/donate">Donate</Link></li>
</ul>
</div>

<div>
<h4 className="font-semibold mb-3">Contact</h4>
<p className="text-gray-400">support@ruralhealthconnect.com</p>
</div>

</div>

</footer>

</main>
)




function Feature({ title, desc, icon }) {
return (
<motion.div
variants={fadeUp}
className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100"
>

<div className="text-3xl mb-4">{icon}</div>

<h3 className="text-xl font-semibold text-teal-600 mb-3">
{title}
</h3>

<p className="text-gray-600 leading-relaxed">
{desc}
</p>

</motion.div>
)
}



function Step({ step, text, delay }) {
return (

<motion.div
initial={{ opacity: 0, x: 150 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay }}
className="flex items-start gap-6 group"
>

<div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-green-400 text-white font-bold shadow-lg z-10">

{step}

<div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-md animate-pulse"></div>

</div>

<div className="flex-1 bg-white text-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300">

<h3 className="text-teal-600 font-semibold mb-2">
Step {step}
</h3>

<p className="text-gray-700">
{text}
</p>

</div>

</motion.div>

)
}



function Counter({ end, label }) {

const [count, setCount] = useState(0)

useEffect(() => {

let start = 0
const duration = 2000
const increment = end / (duration / 20)

const timer = setInterval(() => {
start += increment
if (start >= end) {
setCount(end)
clearInterval(timer)
} else {
setCount(Math.floor(start))
}
}, 20)

return () => clearInterval(timer)

}, [end])

return (
<div>

<h3 className="text-4xl font-bold">
{count}+
</h3>

<p className="mt-2">
{label}
</p>

</div>
)
}



function Blog({ title, image }) {
return (

<motion.div
initial={{ opacity: 0, y: 60 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500"
>

<div className="relative h-52 overflow-hidden">

<Image
src={image}
alt={title}
fill
className="object-cover group-hover:scale-110 transition duration-700"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

</div>

<div className="p-6">

<h3 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition">
{title}
</h3>

<p className="text-gray-600 mt-2 text-sm">
Learn simple health practices to stay safe and healthy in rural communities.
</p>

<button className="mt-4 flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
Read More
<span className="transition-transform group-hover:translate-x-2">→</span>
</button>

</div>

</motion.div>

)
}}

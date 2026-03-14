"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 }
  }
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
}

export default function Home() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -70])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.97])

  return (
    <main className="bg-white text-slate-800 overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-800 via-blue-300 to-lime-800 text-white px-6 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_25%)]" />

        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-24 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 22, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-24 right-10 h-40 w-40 rounded-full bg-lime-200/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-emerald-200/10 blur-2xl"
        />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between pt-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md transition hover:bg-white/15"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg">
              <span className="text-lg font-bold">S</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-white/70">
                SEVA SWASTHYA
              </p>
              <p className="text-base font-semibold text-white">
                Integrated Rural Care
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 rounded-full border border-white/15 bg-black/10 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-md lg:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#ecosystem" className="transition hover:text-white">Ecosystem</a>
            <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
            <a href="#impact" className="transition hover:text-white">Impact</a>
            <a href="#blogs" className="transition hover:text-white">Blogs</a>
          </nav>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            Get Started
            <span>→</span>
          </Link>
        </header>

        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-16 py-14 lg:grid-cols-2"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-lime-300" />
              One platform for healthcare, NGO collaboration, and waste recovery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mt-6 text-5xl font-bold leading-tight md:text-6xl xl:text-7xl"
            >
              Connecting Villages,
              <br />
              Doctors, NGOs
              <br />
              and Waste Networks
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/90"
            >
              Seva Swasthya brings rural healthcare support, NGO coordination,
              low-connectivity access, doctor collaboration, donation visibility,
              and waste management into a single intelligent ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/login"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Enter Platform
              </Link>

              <a
                href="#ecosystem"
                className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-emerald-700"
              >
                See How It Connects
              </a>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3"
            >
              <MiniPill title="Low data design" value="Fast pages" />
              <MiniPill title="Doctor + NGO" value="Collaboration" />
              <MiniPill title="Waste recovery" value="Circular impact" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
         

            <motion.div
              whileHover={{ y: -6, rotate: -1 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-lg"
            >
              <Image
                src="/landingpage.png"
                alt="rural healthcare platform"
                width={720}
                height={540}
                priority
                className="rounded-[1.5rem] object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block h-[100px] w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#f8fafc"
              d="M0,224L80,218.7C160,213,320,203,480,197.3C640,192,800,192,960,181.3C1120,171,1280,149,1360,138.7L1440,128L1440,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* PLATFORM STORY */}
      <section id="ecosystem" className="relative bg-slate-50 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              One ecosystem, many impact paths
            </span>
            <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
              Everything works together, not in isolation
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Instead of separate tools for health reporting, doctor outreach,
              donor visibility, field coordination, and waste recovery, our
              platform brings every critical rural action into one connected flow.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 lg:grid-cols-3"
          >
            <StoryCard
              title="Healthcare Access"
              desc="Doctors publish health guidance, NGOs run camps, and workers surface urgent medical needs from villages."
              tag="Doctors + NGOs + Workers"
              icon="🩺"
            />
            <StoryCard
              title="Low-Connectivity First"
              desc="Pages are designed to remain light and usable even in low-bandwidth areas, improving access in rural regions."
              tag="Fast + practical"
              icon="📶"
            />
            <StoryCard
              title="Waste to Recovery Network"
              desc="Waste generated during drives is documented, listed, and made visible to waste buyers for circular management."
              tag="NGOs + Buyers"
              icon="♻️"
            />
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-slate-900">
                Platform collaboration map
              </h3>
              <p className="mt-3 text-slate-600">
                Each part of the system strengthens the others.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <ConnectBox title="Villagers & Workers" desc="Surface medical needs, sanitation issues, vaccination requirements." />
                <ConnectBox title="Doctors" desc="Publish blogs, verify identity, support NGOs, collaborate on drives." />
                <ConnectBox title="NGOs" desc="Organize drives, post updates, collect field insights, manage community response." />
                <ConnectBox title="Waste Buyers" desc="Discover reusable waste from NGO drives and connect for pickup and purchase." />
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[2rem] bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500 p-8 text-white shadow-xl"
            >
              <h3 className="text-2xl font-bold">
                Why this matters
              </h3>
              <p className="mt-4 leading-8 text-white/90">
                Rural problems are interconnected. Health awareness, medical
                response, NGO coordination, funding, and waste management should
                not be handled in disconnected systems. This platform treats
                them as one rural support network.
              </p>

              <div className="mt-8 space-y-4">
                <ImpactLine text="Faster field-to-doctor communication" />
                <ImpactLine text="Better visibility of NGO impact" />
                <ImpactLine text="Low-friction access in weak networks" />
                <ImpactLine text="Circular waste value from community drives" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-4xl font-bold text-slate-900 md:text-5xl"
          >
            What the platform provides
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            <Feature icon="🩺" title="Doctor Knowledge Hub" desc="Doctors share reliable health blogs and awareness content for communities and NGO networks." />
            <Feature icon="🤝" title="NGO Collaboration" desc="Doctors and NGOs connect through one system to coordinate community health action." />
            <Feature icon="📍" title="Village Need Reporting" desc="Workers can surface disease concerns, vaccination gaps, and sanitation needs from the ground." />
            <Feature icon="💚" title="Low-Connectivity Access" desc="Pages are designed to be lightweight and accessible in rural network conditions." />
            <Feature icon="💰" title="Donation Visibility" desc="Donors can support initiatives with clearer visibility into organizations and activities." />
            <Feature icon="♻️" title="Waste Management Layer" desc="Waste generated during NGO drives can be documented and surfaced to waste buyers." />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white md:px-10">
        <div className="absolute left-10 top-16 h-[340px] w-[340px] rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="absolute bottom-10 right-10 h-[340px] w-[340px] rounded-full bg-lime-400/20 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
              Process flow
            </span>
            <h2 className="mt-5 text-4xl font-bold md:text-5xl">
              How the ecosystem moves
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              A simple chain that turns local reporting into healthcare action,
              collaboration, and waste recovery.
            </p>
          </motion.div>

          <div className="relative mt-20">
            <div className="absolute left-5 top-0 hidden h-full w-[3px] bg-gradient-to-b from-emerald-400 to-lime-400 opacity-70 md:block" />

            <div className="space-y-12">
              <Step step="1" text="Workers and villagers surface local health, sanitation, and vaccination needs." delay={0} />
              <Step step="2" text="NGOs receive field insight and organize targeted drives or interventions." delay={0.08} />
              <Step step="3" text="Doctors contribute health guidance, blogs, and collaborate with NGOs for drives." delay={0.16} />
              <Step step="4" text="Donors and support networks gain visibility into community efforts and impact." delay={0.24} />
              <Step step="5" text="Waste generated from drives is documented and surfaced to waste buyers for further action." delay={0.32} />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 px-6 py-20 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-10 text-center md:grid-cols-4"
          >
            <Counter end={120} label="Villages Connected" />
            <Counter end={80} label="Doctors Participating" />
            <Counter end={35} label="NGOs Registered" />
            <Counter end={1500} label="Citizens Reached" />
          </motion.div>
        </div>
      </section>

      {/* BLOGS */}
      <section id="blogs" className="relative overflow-hidden bg-slate-50 px-6 py-28 md:px-10">
        <div className="absolute left-10 top-10 h-[280px] w-[280px] rounded-full bg-emerald-200/30 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-[280px] w-[280px] rounded-full bg-lime-200/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-4xl font-bold text-slate-900 md:text-5xl"
          >
            Health awareness stories
          </motion.h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <Blog title="Preventing Dengue in Rural Areas" image="/blog1.jpg" />
            <Blog title="Importance of Clean Drinking Water" image="/blog2.jpg" />
            <Blog title="Nutrition Tips for Rural Families" image="/blog3.jpg" />
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              href="/blogs"
              className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-24 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 p-10 text-white shadow-2xl md:p-14"
        >
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-4xl font-bold">
                A single platform for rural action
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
                Enable doctors, NGOs, workers, donors, and waste buyers to act
                together through one connected system designed for real-world
                rural constraints.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                href="/login"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Join the Platform
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-emerald-700"
              >
                Explore Features
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-14 text-white md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">Seva Swasthya</h3>
            <p className="mt-4 leading-7 text-slate-400">
              Connecting rural communities with doctors, NGOs, field workers,
              donors, and waste management stakeholders on one integrated platform.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/doctors">Doctors</Link></li>
              <li><Link href="/ngos">NGOs</Link></li>
              <li><Link href="/workers">Workers</Link></li>
              <li><Link href="/donate">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <p className="text-slate-400">support@sevaswasthya.com</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function MiniPill({ title, value }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
    >
      <p className="text-sm text-white/70">{title}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </motion.div>
  )
}

function Feature({ title, desc, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-[1.75rem] border border-emerald-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-3 text-xl font-semibold text-emerald-700">
        {title}
      </h3>
      <p className="leading-7 text-slate-600">
        {desc}
      </p>
    </motion.div>
  )
}

function StoryCard({ title, desc, tag, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-[1.75rem] border border-emerald-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
        {icon}
      </div>
      <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        {tag}
      </div>
      <h3 className="mt-4 text-2xl font-bold text-slate-900">
        {title}
      </h3>
      <p className="mt-4 leading-7 text-slate-600">
        {desc}
      </p>
    </motion.div>
  )
}

function ConnectBox({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  )
}

function ImpactLine({ text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-lime-300" />
      <p className="text-white/90">{text}</p>
    </div>
  )
}

function Step({ step, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay }}
      className="flex items-start gap-6"
    >
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 font-bold text-white shadow-lg">
        {step}
        <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-md animate-pulse" />
      </div>

      <div className="flex-1 rounded-2xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="mb-2 font-semibold text-emerald-700">Step {step}</h3>
        <p className="leading-7 text-slate-700">{text}</p>
      </div>
    </motion.div>
  )
}

function Counter({ end, label }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1800
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
    <motion.div variants={fadeUp}>
      <h3 className="text-4xl font-bold md:text-5xl">
        {count}+
      </h3>
      <p className="mt-3 text-white/85">{label}</p>
    </motion.div>
  )
}

function Blog({ title, image }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      className="group overflow-hidden rounded-[1.75rem] bg-white shadow-md transition duration-500 hover:shadow-2xl"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-emerald-700">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Learn practical and easy-to-understand health practices for safer and healthier rural communities.
        </p>
        <button className="mt-5 flex items-center gap-2 font-semibold text-emerald-700 transition-all group-hover:gap-3">
          Read More
          <span className="transition-transform group-hover:translate-x-1.5">→</span>
        </button>
      </div>
    </motion.div>
  )
}
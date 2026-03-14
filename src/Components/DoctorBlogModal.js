'use client';

import { useState } from "react";
import { createDoctorBlog } from "../../actions/useractions";

export default function DoctorBlogModal({ doctor, addBlog, close }) {

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: ""
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

async function generateWithAI() {

  try {

    setLoadingAI(true);

    const effectivePrompt = aiPrompt.trim() || formData.title.trim() || formData.content.trim();

    if (!effectivePrompt) {
      alert("Add a title or a few rough notes before using AI Assist.");
      return;
    }

    const res = await fetch("/api/generate-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: effectivePrompt,
        title: formData.title,
        doctorName: doctor?.name || "Doctor"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "AI failed");
      return;
    }

    setFormData({
      ...formData,
      content: data.blog
    });

  } catch (err) {

    console.error(err);
    alert("AI generation failed");

  } finally {

    setLoadingAI(false);

  }
}


  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!doctor?.id) {
      alert("Doctor profile is still loading. Try again in a moment.");
      return;
    }

    const newBlog = await createDoctorBlog(
      doctor.id,
      formData
    );

    if (newBlog) {
      addBlog(newBlog);
      close();
      return;
    }

    alert("Blog save failed. Check the doctor_blogs table and its RLS policies.");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center text-cyan-600 bg-black/40 z-50">

      <div className="bg-white rounded-2xl p-8 w-[600px] shadow-xl">

        <h2 className="text-2xl font-bold mb-4">
          Write Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            placeholder="AI prompt or rough notes"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full border p-3 rounded-lg h-24"
          />
<textarea
  name="content"
  placeholder="Blog content"
  value={formData.content}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg h-40"
/>

<button
  type="button"
  onClick={generateWithAI}
  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
>
  {loadingAI ? "Generating..." : "AI Assist ✨"}
</button>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Publish Blog
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

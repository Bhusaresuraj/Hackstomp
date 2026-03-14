import { supabase } from "@/app/login/supabase";

export async function createOrFetchDoctor() {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No authenticated user");
    return null;
  }

  const email = user.email;
  const name = user.user_metadata?.name || "Doctor";

  console.log("Checking doctor:", name, email);

  const { data: existingDoctor } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingDoctor) {
    console.log("Doctor exists:", existingDoctor);
    return existingDoctor;
  }

  console.log("Doctor not found, creating...");

  const { data, error } = await supabase
    .from("doctors")
    .insert([
      {
        id: user.id,   // 🔥 IMPORTANT
        name: name,
        email: email,
        verified: false
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Doctor creation error:", error);
    return null;
  }

  console.log("Doctor created:", data);

  return data;
}

export async function updateDoctorProfile(id, formData) {

  const { data, error } = await supabase
    .from("doctors")
    .update({
      name: formData.name,
      degree: formData.degree,
      specialization: formData.specialization,
      experience_years: formData.experience_years,
      hospital: formData.hospital,
      bio: formData.bio,
      profile_image: formData.profile_image,
      registration_number: formData.registration_number
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update doctor error:", error);
    return null;
  }

  return data;
}

export async function createDoctorBlog(doctorId, blogData) {

  const { data, error } = await supabase
    .from("doctor_blogs")
    .insert([
      {
        doctor_id: doctorId,
        title: blogData.title,
        content: blogData.content,
        image: blogData.image
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Blog creation error:", error);
    return null;
  }

  return data;
}

export async function getDoctorBlogs(doctorId) {

  const { data, error } = await supabase
    .from("doctor_blogs")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch blogs error:", error);
    return [];
  }

  return data;
}

export async function getAllNgos() {

  const { data, error } = await supabase
    .from("ngos")
    .select("*");

  if (error) {
    console.error("NGO fetch error:", error);
    return [];
  }

  return data || [];
}

export async function getNgoById(id) {

  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getNgoImages(id) {

  const { data, error } = await supabase
    .from("blog_images")
    .select("*")
    .eq("ngo_id", id);

  return data || [];
}


export async function getNgoBlogs(id) {

  console.log("Fetching NGO blogs for:", id);

  const { data, error } = await supabase
    .from("ngo_blogs")
    .select("*")
    .eq("ngo_id", id);

  console.log("Blogs result:", data);

  if (error) {
    console.error("Blog error:", error);
  }

  return data || [];
}




export async function getNgoDrives(id) {

  console.log("Fetching drives for:", id);

  const { data, error } = await supabase
    .from("ngo_drives")
    .select("*")
    .eq("ngo_id", id);

  console.log("Drives result:", data);

  if (error) console.error(error);

  return data || [];
}

export async function connectDoctorToNgo(doctorId, ngoId) {

  const { data, error } = await supabase
    .from("ngo_doctors")
    .insert([
      {
        doctor_id: doctorId,
        ngo_id: ngoId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Connection error:", error);
    return null;
  }

  return data;
}


export async function checkDoctorNgoConnection(doctorId, ngoId) {

  const { data } = await supabase
    .from("ngo_doctors")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("ngo_id", ngoId)
    .single();

  return data;
}

// export async function getDoctorConnectedNgos(doctorId) {

//   const { data } = await supabase
//     .from("ngo_doctors")
//     .select(`
//       ngos (*)
//     `)
//     .eq("doctor_id", doctorId);

//   return data || [];
// }

// export async function getNotConnectedNgos(doctorId) {

//   const { data } = await supabase
//     .from("ngos")
//     .select("*")
//     .not(
//       "id",
//       "in",
//       `(
//         select ngo_id
//         from ngo_doctors
//         where doctor_id='${doctorId}'
//       )`
//     );

//   return data || [];
// }

export async function getDoctorConnections(doctorId) {

  const { data, error } = await supabase
    .from("ngo_doctors")
    .select("ngo_id")
    .eq("doctor_id", doctorId);

  if (error) {
    console.error("Connection fetch error:", error);
    return [];
  }

  return data || [];
}
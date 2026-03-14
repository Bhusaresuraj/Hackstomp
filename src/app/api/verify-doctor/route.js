import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {

    const ip = req.headers.get("x-forwarded-for") || "global";

    const { doctorId } = await req.json();

    const { data: doctor } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", doctorId)
        .single();

    if (!doctor) {
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Skip scraping if already verified
    if (doctor.verified) {
        return NextResponse.json({ verified: true, message: "Already verified" });
    }

    if (!doctor.registration_number) {
        return NextResponse.json({
            verified: false,
            message: "No registration number found on your profile. Please update your profile first."
        }, { status: 400 });
    }

    const regNo = String(doctor.registration_number).trim();

    // Dummy verification: Check if it's exactly 10 digits
    const is10DigitNumber = /^\d{10}$/.test(regNo);

    if (!is10DigitNumber) {
        return NextResponse.json({
            verified: false,
            message: "Registration number not matched with NMC."
        });
    }

    // Since it's exactly 10 digits, we verify it (hackathon prototype)
    // update verified status
    await supabase
        .from("doctors")
        .update({ verified: true })
        .eq("id", doctorId);

    return NextResponse.json({
        verified: true,
        imrData: {
            name: doctor.name,
            registration_number: doctor.registration_number,
            council: "Prototype Council"
        }
    });
}
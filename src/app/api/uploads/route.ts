import { NextResponse } from "next/server";
import { supabase, getPublicUrl } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;

    console.log("Attempting to upload file:", fileName);

    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("File uploaded successfully:", data);

    const publicUrl = getPublicUrl('attachments', fileName)
   
    if (!publicUrl) {
      console.error("Error getting public URL: No URL returned")
      return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
    }

    console.log("Public URL retrieved:", publicUrl)

    return NextResponse.json({ fileUrl: publicUrl });
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return NextResponse.json({ error: "Unexpected upload error" }, { status: 500 });
  }
}


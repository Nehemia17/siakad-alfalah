"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Teacher {
  id: string;
  nip: string | null;
  nama_lengkap: string;
  gelar: string | null;
  jenis_kelamin: string;
  telepon: string | null;
  email: string | null;
  status_kepegawaian: string;
  created_at: string;
  updated_at: string;
}

export async function getTeachers(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`nama_lengkap.ilike.${term},nip.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data as Teacher[]) || [];
}

export async function createTeacher(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    nip: (formData.get("nip") as string) || null,
    nama_lengkap: formData.get("nama_lengkap") as string,
    gelar: (formData.get("gelar") as string) || null,
    jenis_kelamin: formData.get("jenis_kelamin") as string,
    telepon: (formData.get("telepon") as string) || null,
    email: (formData.get("email") as string) || null,
    status_kepegawaian: (formData.get("status_kepegawaian") as string) || "Tetap",
  };

  const { error } = await supabase.from("teachers").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "NIP sudah terdaftar dalam sistem." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/guru");
  return { success: true, message: "Data guru berhasil ditambahkan." };
}

export async function updateTeacher(id: string, formData: FormData) {
  const supabase = await createClient();

  const payload = {
    nip: (formData.get("nip") as string) || null,
    nama_lengkap: formData.get("nama_lengkap") as string,
    gelar: (formData.get("gelar") as string) || null,
    jenis_kelamin: formData.get("jenis_kelamin") as string,
    telepon: (formData.get("telepon") as string) || null,
    email: (formData.get("email") as string) || null,
    status_kepegawaian: (formData.get("status_kepegawaian") as string) || "Tetap",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("teachers")
    .update(payload)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "NIP sudah digunakan guru lain." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/guru");
  return { success: true, message: "Data guru berhasil diperbarui." };
}

export async function deleteTeacher(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("teachers").delete().eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/guru");
  return { success: true, message: "Data guru berhasil dihapus." };
}

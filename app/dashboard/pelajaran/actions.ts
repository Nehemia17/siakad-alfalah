"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Subject {
  id: string;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
  tingkat: string;
  teacher_id: string | null;
  created_at: string;
  updated_at: string;
  teachers?: {
    id: string;
    nama_lengkap: string;
    gelar: string | null;
  } | null;
}

export async function getSubjects(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("subjects")
    .select("*, teachers(id, nama_lengkap, gelar)")
    .order("created_at", { ascending: false });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`kode_mapel.ilike.${term},nama_mapel.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data as Subject[]) || [];
}

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized: sesi tidak valid.");
  return supabase;
}

export async function createSubject(formData: FormData) {
  const supabase = await requireAuth();

  const teacherId = formData.get("teacher_id") as string;

  const payload = {
    kode_mapel: formData.get("kode_mapel") as string,
    nama_mapel: formData.get("nama_mapel") as string,
    kelompok: formData.get("kelompok") as string,
    tingkat: (formData.get("tingkat") as string) || "Semua",
    teacher_id: teacherId && teacherId !== "" ? teacherId : null,
  };

  const { error } = await supabase.from("subjects").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Kode mata pelajaran sudah terdaftar." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/pelajaran");
  return { success: true, message: "Mata pelajaran berhasil ditambahkan." };
}

export async function updateSubject(id: string, formData: FormData) {
  const supabase = await requireAuth();

  const teacherId = formData.get("teacher_id") as string;

  const payload = {
    kode_mapel: formData.get("kode_mapel") as string,
    nama_mapel: formData.get("nama_mapel") as string,
    kelompok: formData.get("kelompok") as string,
    tingkat: (formData.get("tingkat") as string) || "Semua",
    teacher_id: teacherId && teacherId !== "" ? teacherId : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("subjects")
    .update(payload)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Kode mata pelajaran sudah digunakan." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/pelajaran");
  return { success: true, message: "Mata pelajaran berhasil diperbarui." };
}

export async function deleteSubject(id: string) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/pelajaran");
  return { success: true, message: "Mata pelajaran berhasil dihapus." };
}

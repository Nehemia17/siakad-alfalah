"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Student {
  id: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tingkat: string;
  jurusan: string;
  telepon: string | null;
  alamat: string | null;
  status_siswa: string;
  created_at: string;
  updated_at: string;
}

export async function getStudents(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`nama_lengkap.ilike.${term},nisn.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data as Student[]) || [];
}

export async function createStudent(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    nisn: formData.get("nisn") as string,
    nama_lengkap: formData.get("nama_lengkap") as string,
    jenis_kelamin: formData.get("jenis_kelamin") as string,
    tingkat: formData.get("tingkat") as string,
    jurusan: formData.get("jurusan") as string,
    telepon: (formData.get("telepon") as string) || null,
    alamat: (formData.get("alamat") as string) || null,
    status_siswa: (formData.get("status_siswa") as string) || "Aktif",
  };

  const { error } = await supabase.from("students").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "NISN sudah terdaftar dalam sistem." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/siswa");
  return { success: true, message: "Data siswa berhasil ditambahkan." };
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient();

  const payload = {
    nisn: formData.get("nisn") as string,
    nama_lengkap: formData.get("nama_lengkap") as string,
    jenis_kelamin: formData.get("jenis_kelamin") as string,
    tingkat: formData.get("tingkat") as string,
    jurusan: formData.get("jurusan") as string,
    telepon: (formData.get("telepon") as string) || null,
    alamat: (formData.get("alamat") as string) || null,
    status_siswa: (formData.get("status_siswa") as string) || "Aktif",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "NISN sudah digunakan siswa lain." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/siswa");
  return { success: true, message: "Data siswa berhasil diperbarui." };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/siswa");
  return { success: true, message: "Data siswa berhasil dihapus." };
}

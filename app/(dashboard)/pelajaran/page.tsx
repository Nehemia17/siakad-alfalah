"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileX2,
} from "lucide-react";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
} from "./actions";
import { getTeachers, type Teacher } from "../guru/actions";
import { showSuccessToast, showErrorAlert, showConfirmDelete } from "@/lib/swal";

const ITEMS_PER_PAGE = 10;

const kelompokOptions = [
  "Muatan Nasional",
  "Muatan Kewilayahan",
  "Dasar Bidang Keahlian",
  "Dasar Program Keahlian",
  "Kompetensi Keahlian",
];

export default function PelajaranPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Subject | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subjectsData, teachersData] = await Promise.all([
        getSubjects(search),
        getTeachers(),
      ]);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch {
      showErrorAlert("Gagal Memuat", "Tidak dapat mengambil data mata pelajaran.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);
  const paginatedData = subjects.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const openAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditData(subject);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    let result;

    if (editData) {
      result = await updateSubject(editData.id, formData);
    } else {
      result = await createSubject(formData);
    }

    if (result.success) {
      showSuccessToast(result.message);
      setModalOpen(false);
      fetchData();
    } else {
      showErrorAlert("Gagal", result.message);
    }

    setSubmitting(false);
  };

  const handleDelete = async (subject: Subject) => {
    const confirmed = await showConfirmDelete(subject.nama_mapel);
    if (!confirmed) return;

    const result = await deleteSubject(subject.id);
    if (result.success) {
      showSuccessToast(result.message);
      fetchData();
    } else {
      showErrorAlert("Gagal Menghapus", result.message);
    }
  };

  const tingkatColor = (tingkat: string) => {
    switch (tingkat) {
      case "X":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "XI":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "XII":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-forest-600" />
            Mata Pelajaran
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola data mata pelajaran dan guru pengampu
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-forest-700 text-white text-sm font-medium shadow-sm hover:bg-forest-800 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Mapel
        </button>
      </div>

      {/* Search + Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan kode atau nama mapel..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-forest-600 animate-spin" />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FileX2 className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Tidak ada data ditemukan</p>
            <p className="text-xs mt-1">
              {search
                ? "Coba ubah kata kunci pencarian"
                : "Klik tombol Tambah Mapel untuk memulai"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">
                    Kode
                  </th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3">
                    Nama Mata Pelajaran
                  </th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3 hidden md:table-cell">
                    Kelompok
                  </th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3 hidden sm:table-cell">
                    Tingkat
                  </th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-3 hidden lg:table-cell">
                    Guru Pengampu
                  </th>
                  <th className="text-right font-semibold text-slate-600 px-4 py-3">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-forest-700">
                      {s.kode_mapel}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {s.nama_mapel}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {s.kelompok}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${tingkatColor(
                          s.tingkat
                        )}`}
                      >
                        {s.tingkat === "Semua" ? "Semua Tingkat" : `Kelas ${s.tingkat}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                      {s.teachers
                        ? s.teachers.gelar
                          ? `${s.teachers.nama_lengkap}, ${s.teachers.gelar}`
                          : s.teachers.nama_lengkap
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2 rounded-lg text-slate-400 hover:text-forest-700 hover:bg-forest-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(page * ITEMS_PER_PAGE, subjects.length)} dari{" "}
              {subjects.length} data
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[32px] h-8 rounded-md text-xs font-medium transition-colors ${
                    page === p
                      ? "bg-forest-700 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !submitting && setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editData ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
              </h2>
              <button
                onClick={() => !submitting && setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Kode Mapel <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="kode_mapel"
                    required
                    maxLength={20}
                    defaultValue={editData?.kode_mapel || ""}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white transition-all"
                    placeholder="MTK-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tingkat Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tingkat"
                    required
                    defaultValue={editData?.tingkat || "Semua"}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white transition-all"
                  >
                    <option value="Semua">Semua Tingkat</option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama_mapel"
                  required
                  maxLength={100}
                  defaultValue={editData?.nama_mapel || ""}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white transition-all"
                  placeholder="Nama mata pelajaran"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kelompok <span className="text-red-500">*</span>
                </label>
                <select
                  name="kelompok"
                  required
                  defaultValue={editData?.kelompok || ""}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white transition-all"
                >
                  <option value="">Pilih kelompok</option>
                  {kelompokOptions.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Guru Pengampu
                </label>
                <select
                  name="teacher_id"
                  defaultValue={editData?.teacher_id || ""}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 focus:bg-white transition-all"
                >
                  <option value="">Belum ditentukan</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama_lengkap}
                      {t.gelar ? `, ${t.gelar}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-5 rounded-lg text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editData ? "Simpan Perubahan" : "Tambah Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

-- ================================================================================
-- SIAKAD SMKS AL FALAH - Database Schema
-- Jalankan script ini di Supabase SQL Editor
-- ================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABEL GURU
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nip VARCHAR(30) UNIQUE,
  nama_lengkap VARCHAR(150) NOT NULL,
  gelar VARCHAR(30),
  jenis_kelamin VARCHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
  telepon VARCHAR(20),
  email VARCHAR(100),
  status_kepegawaian VARCHAR(20) DEFAULT 'Tetap' CHECK (status_kepegawaian IN ('Tetap', 'Honorer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL SISWA
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nisn VARCHAR(15) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(150) NOT NULL,
  jenis_kelamin VARCHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
  tingkat VARCHAR(5) CHECK (tingkat IN ('X', 'XI', 'XII')) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  telepon VARCHAR(20),
  alamat TEXT,
  status_siswa VARCHAR(20) DEFAULT 'Aktif' CHECK (status_siswa IN ('Aktif', 'Lulus', 'Pindah', 'Keluar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABEL MATA PELAJARAN
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_mapel VARCHAR(20) UNIQUE NOT NULL,
  nama_mapel VARCHAR(100) NOT NULL,
  kelompok VARCHAR(50) NOT NULL,
  tingkat VARCHAR(5) CHECK (tingkat IN ('Semua', 'X', 'XI', 'XII')) DEFAULT 'Semua',
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXING OPTIMASI PENCARIAN
CREATE INDEX idx_students_nama ON public.students (nama_lengkap);
CREATE INDEX idx_students_nisn ON public.students (nisn);
CREATE INDEX idx_teachers_nama ON public.teachers (nama_lengkap);
CREATE INDEX idx_subjects_kode ON public.subjects (kode_mapel);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on teachers" ON public.teachers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on students" ON public.students
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on subjects" ON public.subjects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

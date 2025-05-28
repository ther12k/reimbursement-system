# Panduan Prettier untuk ReimburseEase

## Pengenalan

Prettier adalah code formatter yang membantu memastikan format kode yang konsisten di seluruh proyek. Prettier bekerja bersama dengan ESLint untuk memberikan pengalaman pengembangan yang optimal.

## Konfigurasi

Konfigurasi Prettier disimpan dalam file `.prettierrc` dengan pengaturan berikut:

- **Semi**: Menggunakan semicolon di akhir statement
- **Trailing Comma**: Menggunakan trailing comma untuk ES5 (objects, arrays, etc.)
- **Single Quote**: Menggunakan double quotes untuk string
- **Print Width**: Maksimal 80 karakter per baris
- **Tab Width**: 2 spasi untuk indentasi
- **Bracket Spacing**: Spasi di dalam object brackets
- **Arrow Parens**: Menghindari parentheses untuk arrow function dengan satu parameter

## Menjalankan Prettier

### Format Semua File

Untuk memformat semua file dalam proyek:

\`\`\`bash
npm run format
\`\`\`

### Memeriksa Format

Untuk memeriksa apakah semua file sudah diformat dengan benar:

\`\`\`bash
npm run format:check
\`\`\`

### Menjalankan Lint dan Format Bersamaan

Untuk menjalankan ESLint dan memeriksa format Prettier:

\`\`\`bash
npm run check-all
\`\`\`

## Integrasi dengan Editor

### Visual Studio Code

1. **Instal Ekstensi**:
   - Prettier - Code formatter
   - ESLint

2. **Konfigurasi Otomatis**:
   - File `.vscode/settings.json` sudah dikonfigurasi untuk format otomatis saat menyimpan
   - Prettier akan berjalan setelah ESLint memperbaiki masalah

### Ekstensi Browser

Untuk pengembangan yang lebih baik, instal ekstensi berikut di VS Code:

- **Prettier - Code formatter**: Format kode otomatis
- **ESLint**: Deteksi masalah kode
- **Auto Rename Tag**: Rename tag HTML/JSX otomatis
- **Bracket Pair Colorizer**: Warna bracket yang berbeda
- **GitLens**: Informasi Git yang lebih baik

## Integrasi dengan Git

### Pre-commit Hooks

Prettier terintegrasi dengan lint-staged untuk memformat kode sebelum commit:

\`\`\`bash
# Install husky dan lint-staged
npm install --save-dev husky lint-staged

# Setup husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
\`\`\`

### Workflow Git

1. **Sebelum Commit**: lint-staged akan menjalankan ESLint dan Prettier pada file yang diubah
2. **Format Otomatis**: File akan diformat secara otomatis sebelum commit
3. **Konsistensi**: Semua anggota tim akan memiliki format kode yang sama

## Aturan Format

### JavaScript/TypeScript

\`\`\`javascript
// Sebelum Prettier
const user={name:"John",age:30,email:"john@example.com"};

// Setelah Prettier
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
};
\`\`\`

### JSX/TSX

\`\`\`jsx
// Sebelum Prettier
<Button onClick={handleClick} className="btn-primary" disabled={isLoading}>Submit</Button>

// Setelah Prettier
<Button
  onClick={handleClick}
  className="btn-primary"
  disabled={isLoading}
>
  Submit
</Button>
\`\`\`

### Import Statements

\`\`\`typescript
// Sebelum Prettier
import {useState,useEffect} from "react";
import {Button} from "@/components/ui/button";

// Setelah Prettier
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
\`\`\`

## Mengatasi Konflik

### ESLint vs Prettier

Jika ada konflik antara ESLint dan Prettier:

1. **Periksa Konfigurasi**: Pastikan `eslint-config-prettier` sudah diinstal dan dikonfigurasi
2. **Urutan Ekstensi**: Prettier harus menjadi ekstensi terakhir di ESLint config
3. **Aturan Khusus**: Gunakan `prettier/prettier` rule untuk menampilkan error Prettier sebagai ESLint error

### Kustomisasi

Untuk menyesuaikan aturan Prettier, edit file `.prettierrc`:

\`\`\`json
{
  "printWidth": 100,  // Ubah lebar maksimal
  "singleQuote": true,  // Gunakan single quote
  "trailingComma": "all"  // Trailing comma di semua tempat
}
\`\`\`

## Tips dan Trik

1. **Format on Save**: Aktifkan format on save di editor untuk format otomatis
2. **Ignore Files**: Gunakan `.prettierignore` untuk mengabaikan file tertentu
3. **Konsistensi Tim**: Pastikan semua anggota tim menggunakan konfigurasi yang sama
4. **CI/CD**: Tambahkan check format di pipeline CI/CD

## Troubleshooting

### Prettier Tidak Berjalan

1. Periksa apakah ekstensi Prettier terinstal di VS Code
2. Pastikan file `.prettierrc` ada di root project
3. Periksa konfigurasi VS Code di `.vscode/settings.json`

### Konflik dengan ESLint

1. Pastikan `eslint-config-prettier` terinstal
2. Tambahkan "prettier" di akhir array extends di `.eslintrc.js`
3. Restart VS Code setelah mengubah konfigurasi
\`\`\`

Mari buat file konfigurasi untuk Husky (pre-commit hooks):

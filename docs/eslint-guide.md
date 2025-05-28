# Panduan ESLint untuk ReimburseEase

## Pengenalan

ESLint adalah alat analisis kode statis yang membantu mengidentifikasi pola bermasalah dalam kode JavaScript/TypeScript. Dalam proyek ReimburseEase, ESLint dikonfigurasi untuk mendeteksi berbagai masalah sintaks dan gaya penulisan kode.

## Menjalankan ESLint

### Memeriksa Kode

Untuk memeriksa kode tanpa melakukan perubahan:

\`\`\`bash
npm run lint
\`\`\`

### Memperbaiki Masalah Secara Otomatis

Untuk memperbaiki masalah yang dapat diperbaiki secara otomatis:

\`\`\`bash
npm run lint:fix
\`\`\`

## Aturan Penting

Beberapa aturan penting yang diterapkan:

1. **no-multi-str**: Mencegah string multi-baris yang tidak menggunakan template literals
2. **no-template-curly-in-string**: Mencegah penggunaan `${expression}` dalam string biasa
3. **quotes**: Mengharuskan penggunaan tanda kutip ganda untuk string
4. **import/order**: Mengatur urutan import untuk konsistensi

## Integrasi dengan Editor

### Visual Studio Code

1. Instal ekstensi ESLint
2. Konfigurasi sudah diatur di `.vscode/settings.json` untuk memperbaiki masalah saat menyimpan file

### Integrasi dengan Git Hooks

Untuk memastikan kode yang di-commit selalu mematuhi aturan ESLint, gunakan Husky dan lint-staged:

\`\`\`bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
\`\`\`

Tambahkan konfigurasi berikut ke package.json:

\`\`\`json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint --fix"
  }
}
\`\`\`

## Mengatasi Masalah Umum

### Unescaped Line Breaks

Jika ESLint melaporkan "Unescaped line break in string literal", perbaiki dengan:

1. Menggunakan template literals: `` `string dengan baris baru` ``
2. Menggabungkan string: `"baris pertama" + "baris kedua"`
3. Menggunakan JSX untuk konten multi-baris

### Penggunaan Console.log

Console.log diperbolehkan dalam pengembangan tetapi akan memunculkan peringatan di mode produksi. Hapus console.log sebelum deployment.

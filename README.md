# Google Docs Clone 📝

![Google Docs Clone](./public/google-doc-clone.gif)

<div align="center">
  <h4>A full-featured Google Docs clone built with modern web technologies</h4>
</div>

<div align="center">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TipTap](https://img.shields.io/badge/TipTap-Editor-green?style=for-the-badge)](https://tiptap.dev/)
  [![Convex](https://img.shields.io/badge/Convex-Database-blue?style=for-the-badge)](https://www.convex.dev/)
  [![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple?style=for-the-badge)](https://clerk.dev/)
  [![Liveblocks](https://img.shields.io/badge/Liveblocks-Realtime-orange?style=for-the-badge)](https://liveblocks.io/)

</div>

## 🌟 Features

- 📝 Real-time collaborative editing
- 🎨 Rich text formatting
- 📊 Tables support
- 📷 Image insertion and resizing
- 📝 Comments and suggestions
- 📱 Responsive design
- 🎯 Cursor presence
- 🔍 Document search
- 🔒 Authentication & Authorization
- 👥 Multi-user support
- 🎨 Custom themes
- 📱 Mobile responsive
- 🖨️ Print support

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Database:** [Convex](https://www.convex.dev/)
- **Real-time Collaboration:** [Liveblocks](https://liveblocks.io/)
- **Text Editor:** [TipTap](https://tiptap.dev/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or bun

## 🛠️ Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/pakagronglb/google-docs-clone.git
   ```

2. Install dependencies
   ```bash
   # Using npm
   npm install --legacy-peer-deps  # Required due to React 19 RC

   # Using bun
   bun install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   - `CONVEX_DEPLOYMENT`
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `LIVEBLOCKS_SECRET_KEY`

4. Start the development servers

   Terminal 1 - Next.js server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

   Terminal 2 - Convex server:
   ```bash
   npx convex dev
   # or
   bunx convex dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Production Deployment

To deploy on Vercel:

1. Replace the build command:
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```

2. Set the install command to:
   ```bash
   npm install --legacy-peer-deps
   ```

## 💡 Important Notes

- This project uses React 19 (Release Candidate) with Next.js 15
- Some dependencies require the `--legacy-peer-deps` flag when using npm
- Bun users can install normally without special flags

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

This project is based on the tutorial by [Antonio from CodeWithAntonio](https://codewithantonio.com). Check out his website for more amazing tutorials and courses.

## 🔗 Links

- [CodeWithAntonio](https://codewithantonio.com)
- [Tutorial Link](https://codewithantonio.com/projects/google-docs-clone)

---

<div align="center">
  Made with ❤️ by Pakagrong Lebel, based on CodeWithAntonio's tutorial
</div>

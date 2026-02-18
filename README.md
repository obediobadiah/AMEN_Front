# AMEN Platform - Frontend

![AMEN Platform](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop)

The **AMEN Platform Frontend** is a modern, high-performance web application built to support the mission of the AMEN organization. It focuses on social impact, community empowerment, and environmental sustainability, providing a seamless experience for donors, volunteers, and community members.

## ✨ Key Features

-   **🌍 Multi-language Support**: Full internationalization (i18n) for **English** and **French** using `next-intl`.
-   **🎨 Premium UI/UX**: Built with **Tailwind CSS** and **Shadcn UI** for a sleek, modern, and responsive design.
-   **⚡ High Performance**: Leveraging **Next.js** for server-side rendering and optimal performance.
-   **🎭 Smooth Animations**: Interactive elements enhanced with **Framer Motion**.
-   **📊 Dynamic Content**: Real-time stats, donation progress tracking, and latest news updates.
-   **🛡️ Admin Dashboard**: Dedicated management interface for programs, news, and organizational content.
-   **📱 Fully Responsive**: Optimized for all devices, from mobile phones to high-resolution desktops.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **State/Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.0.0 or higher
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/amen-frontend.git
    cd amen-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory (refer to `.env.example` if available).

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📂 Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `client/src/components/`: Reusable UI components.
-   `client/src/pages/`: Main page content and complex views.
-   `messages/`: i18n translation files (`en.json`, `fr.json`).
-   `public/`: Static assets such as images and fonts.
-   `lib/`: Utility functions, mock data, and configurations.

## 🌐 Internationalization (i18n)

Translations are managed in the `messages/` directory.

-   To add a new translation string, update both `messages/en.json` and `messages/fr.json`.
-   Use the `useTranslations` hook in your components:
    ```tsx
    const t = useTranslations('AboutPage');
    return <h1>{t('title')}</h1>;
    ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

Built with ❤️ by the AMEN Platform Team.

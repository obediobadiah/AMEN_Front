import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from "./providers";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const ogImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: "AMEN - Alternatives Ménages, Nature et Marchés",
    description:
        "Organisation Humanitaire dédiée à l'autonomisation des communautés, à la protection de l'environnement et au développement durable.",
    openGraph: {
        title: "AMEN - Alternatives Ménages, Nature et Marchés",
        description:
            "Organisation Humanitaire dédiée à l'autonomisation des communautés, à la protection de l'environnement et au développement durable.",
        type: "website",
        images: [ogImage],
    },
    twitter: {
        card: "summary_large_image",
        site: "@amen_ngo",
        title: "AMEN - Alternatives Ménages, Nature et Marchés",
        description:
            "Organisation Humanitaire dédiée à l'autonomisation des communautés, à la protection de l'environnement et au développement durable.",
        images: [ogImage],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className="font-sans">
            <head>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

import ArticleDetail from "@/pages/ArticleDetail";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return <ArticleDetail id={id} />;
}

export async function generateStaticParams() {
    return [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
        { id: "6" }
    ];
}

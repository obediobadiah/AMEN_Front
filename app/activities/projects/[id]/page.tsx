import ProjectDetail from "@/pages/ProjectDetail";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return <ProjectDetail id={id} />;
}

export async function generateStaticParams() {
    return [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" }
    ];
}

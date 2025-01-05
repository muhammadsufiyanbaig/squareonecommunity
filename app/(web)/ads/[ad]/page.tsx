import AdDetails from "@/app/components/AdDetails";

export default async function  AdDetailsPage({ params }: { params: Promise<{ ad: string }> }) {
    const {ad} = await params;
    return <AdDetails adId={ad} />
}


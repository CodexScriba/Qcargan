import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function VehiclesPage({ params }: PageProps) {
  const awaitedParams = await params;
  const t = await getTranslations({ locale: awaitedParams.locale });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold">Vehicles</h1>
      <p className="text-muted-foreground">Browse our selection of electric vehicles.</p>
    </div>
  );
}

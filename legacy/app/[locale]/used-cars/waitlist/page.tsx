import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function UsedCarsWaitlistPage({ params }: PageProps) {
  const awaitedParams = await params;
  const t = await getTranslations({ locale: awaitedParams.locale });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold">Used EV Marketplace - Waitlist</h1>
      <p className="mb-8 text-muted-foreground">Join the waitlist for our upcoming used EV marketplace.</p>
      <div className="rounded-lg border p-6">
        <p className="text-center text-lg">Coming soon in Q3 2025</p>
      </div>
    </div>
  );
}

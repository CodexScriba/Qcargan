import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function LoginPage({ params }: PageProps) {
  const awaitedParams = await params;
  const t = await getTranslations({ locale: awaitedParams.locale });

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <p className="text-center text-muted-foreground">Sign in to your account</p>
        <div className="text-center text-sm text-muted-foreground">Login form coming soon...</div>
      </div>
    </div>
  );
}

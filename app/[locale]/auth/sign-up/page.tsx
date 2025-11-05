import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function SignUpPage({ params }: PageProps) {
  const awaitedParams = await params;
  const t = await getTranslations({ locale: awaitedParams.locale });

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <p className="text-center text-muted-foreground">Sign up to get started</p>
        <div className="text-center text-sm text-muted-foreground">Sign up form coming soon...</div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-1 w-full items-center justify-center px-6 py-10 md:px-10">
      <Card className="w-full max-w-md overflow-hidden border border-[#e5e7eb] rounded-[22px] shadow-[0_10px_25px_rgba(2,0,68,.08),_0_2px_6px_rgba(2,0,68,.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(2,0,68,.12),_0_4px_10px_rgba(2,0,68,.08)] p-0">
        {/* Red accent line for error */}
        <div className="h-[3px] w-full bg-[hsl(var(--semantic-error))]" aria-hidden="true" />
        <div className="px-6 py-5 flex flex-col justify-center min-h-[320px]">
          <header className="mb-2 text-center">
            <h1 className="mb-1 text-[clamp(22px,3vw,28px)] font-[800] tracking-tight text-[hsl(var(--primary))]">
              <span aria-hidden="true">⚠️</span> Sorry, something went wrong.
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {params?.error ? `Code error: ${params.error}` : 'An unspecified error occurred.'}
            </p>
          </header>
          <div className="mt-4 flex justify-center">
            <Button
              asChild
              className="rounded-full font-bold bg-[hsl(var(--primary))] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Link href="/" aria-label="Return to home">
                <span aria-hidden="true" className="mr-1">🏠</span>
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md overflow-hidden border border-[#e5e7eb] rounded-[22px] shadow-[0_10px_25px_rgba(2,0,68,.08),_0_2px_6px_rgba(2,0,68,.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(2,0,68,.12),_0_4px_10px_rgba(2,0,68,.08)] p-0">
        {/* Teal accent line on card border */}
        <div className="h-[3px] w-full bg-[hsl(var(--brand))]" aria-hidden="true" />
        <div className="px-6 py-5 flex flex-col justify-center min-h-[360px]">
          <header className="mb-4 text-center">
            <h1 className="mb-1 text-[clamp(22px,3vw,28px)] font-[800] tracking-tight text-[hsl(var(--dark-blue))]">
              <span aria-hidden="true">🎉</span> Thank you for signing up!
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Check your email to confirm</p>
          </header>
          <div className="space-y-3 text-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
            <div className="inline-flex items-center justify-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <span aria-hidden="true">📧</span>
              <span>Confirmation email sent</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

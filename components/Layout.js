import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/deal', label: 'Deal calculator' },
  { href: '/value', label: 'Value estimator' },
  { href: '/damage', label: 'Repair cost' },
  { href: '/saved', label: 'Saved' },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            Salvage Deal Calculator
          </Link>
          <nav className="flex gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/' ? router.pathname === '/' : router.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber text-ink'
                      : 'text-paper/80 hover:bg-white/10 hover:text-paper'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>

      <footer className="border-t border-steel/20 bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-steel">
          All figures on this site are rough estimates for planning purposes only — not
          appraisals, quotes, or guarantees. Always cross-check vehicle values, confirm repair
          costs with a shop, and verify local tax and title rules before you bid.
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-brand-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Family Adda Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-brand-100" />
            <span className="text-xl font-bold text-brand-800 tracking-tight">
              Family Adda
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/admin/menu" className="hover:text-brand-600 transition-colors">
              Menu
            </Link>
            <Link href="/admin" className="hover:text-brand-600 transition-colors">
              Admin
            </Link>
            <Link href="/admin/kitchen" className="hover:text-brand-600 transition-colors">
              Kitchen
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full border border-brand-200">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Now accepting orders
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl">
            We serve <span className="text-brand-600">What</span> we Eat
          </h1>

          <p className="text-lg text-gray-500 max-w-xl">
            Family Adda brings authentic home-style flavours to your table.
            Browse our menu, place your order, and watch it come to life in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/admin/menu"
              className="bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              Browse Menu
            </Link>
            <Link
              href="/admin/kitchen"
              className="border border-brand-200 text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Kitchen Display →
            </Link>
          </div>
        </section>

        {/* ── Feature cards ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "Live Menu",
              desc: "Real-time availability — items marked unavailable disappear instantly.",
              href: "/order/preview",
              cta: "View Menu",
            },
            {
              icon: "🧑‍🍳",
              title: "Kitchen Display",
              desc: "Kitchen staff see new orders the moment they come in — no paper tickets.",
              href: "/admin/kitchen",
              cta: "Open KDS",
            },
            {
              icon: "⚙️",
              title: "Admin Panel",
              desc: "Manage your menu, track orders, and monitor revenue from one dashboard.",
              href: "/admin",
              cta: "Go to Admin",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:shadow-md transition-all bg-white flex flex-col gap-3"
            >
              <span className="text-4xl">{card.icon}</span>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-gray-500 flex-1">{card.desc}</p>
              <span className="text-sm font-semibold text-brand-600 group-hover:underline">
                {card.cta} →
              </span>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
}

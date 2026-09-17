with open('src/app/page.tsx', 'r') as f:
    c = f.read()

# Fix the map mistake
c = c.replace("""
            <Link
              key={card.title}
              href="/api/auto-login?redirect=/admin"
              className="group border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:shadow-md transition-all bg-white flex flex-col gap-3"
            >
              <span className="text-4xl">⚙️</span>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-500 flex-1">Manage your menu, track orders, and monitor revenue from one dashboard.</p>
              <span className="text-sm font-semibold text-brand-600 group-hover:underline">
                Go to Admin →
              </span>
            </Link>
""", """
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
""")

c = c.replace('href: "/admin"', 'href: "/api/auto-login?redirect=/admin"')
c = c.replace('href: "/admin/kitchen"', 'href: "/api/auto-login?redirect=/admin/kitchen&role=kitchen"')
c = c.replace('href="/admin"', 'href="/api/auto-login?redirect=/admin"')
c = c.replace('href="/admin/kitchen"', 'href="/api/auto-login?redirect=/admin/kitchen&role=kitchen"')

with open('src/app/page.tsx', 'w') as f:
    f.write(c)

with open('src/app/(admin)/admin/menu/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('return <div className="text-red-500">Error loading catalog.</div>;',
              'return <div className="text-red-500 p-8"><h3>Error loading catalog.</h3><pre className="mt-4 p-4 bg-red-50 rounded text-xs overflow-auto">{JSON.stringify({ catError, itemError, restaurantId }, null, 2)}</pre></div>;')

with open('src/app/(admin)/admin/menu/page.tsx', 'w') as f:
    f.write(c)


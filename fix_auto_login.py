with open('src/app/api/auto-login/route.ts', 'r') as f:
    c = f.read()

c = c.replace('|| "/admin"', '|| "/admin/dashboard"')

with open('src/app/api/auto-login/route.ts', 'w') as f:
    f.write(c)

with open('src/app/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('redirect=/admin"', 'redirect=/admin/dashboard"')
c = c.replace('redirect=/admin/kitchen"', 'redirect=/admin/kitchen"')

with open('src/app/page.tsx', 'w') as f:
    f.write(c)

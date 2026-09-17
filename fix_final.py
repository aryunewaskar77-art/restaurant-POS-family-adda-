with open('src/actions/editAuth.ts', 'r') as f:
    c = f.read()
    c = c.replace('data?.role', '(data as any)?.role')
with open('src/actions/editAuth.ts', 'w') as f:
    f.write(c)

with open('src/actions/sectionAuth.ts', 'r') as f:
    c = f.read()
    c = c.replace('data?.role', '(data as any)?.role')
with open('src/actions/sectionAuth.ts', 'w') as f:
    f.write(c)

with open('src/app/(admin)/admin/reports/page.tsx', 'r') as f:
    c = f.read()
    c = c.replace('metrics?.grossRevenue', '(metrics?.grossRevenue || 0)')
with open('src/app/(admin)/admin/reports/page.tsx', 'w') as f:
    f.write(c)

with open('src/components/kitchen/KDSBoard.tsx', 'r') as f:
    c = f.read()
    if 'KDSTicketData' not in c.split('interface')[0]:
        c = c.replace('import type { OrderStatus } from "@/types/database.types";', 'import type { OrderStatus } from "@/types/database.types";\nimport type { KDSTicketData } from "@/types/domain";')
    
    c = c.replace('const first = group[0];', 'const first = (group as any)[0];')
    c = c.replace('const matchOrderHash = group.some((o: any) => o.id.toLowerCase().includes(q));', 'const matchOrderHash = (group as any[]).some((o: any) => o.id.toLowerCase().includes(q));')
    c = c.replace('const matchTicketNo = group.some((o: any) => o.ticket_number ? String(o.ticket_number).includes(q) : false);', 'const matchTicketNo = (group as any[]).some((o: any) => o.ticket_number ? String(o.ticket_number).includes(q) : false);')
    c = c.replace('const aTime = Math.min(...a.map((o: any) => new Date(o.placed_at).getTime()));', 'const aTime = Math.min(...(a as any[]).map((o: any) => new Date(o.placed_at).getTime()));')
    c = c.replace('const bTime = Math.min(...b.map((o: any) => new Date(o.placed_at).getTime()));', 'const bTime = Math.min(...(b as any[]).map((o: any) => new Date(o.placed_at).getTime()));')
with open('src/components/kitchen/KDSBoard.tsx', 'w') as f:
    f.write(c)

import re

with open('src/components/kitchen/KDSBoard.tsx', 'r') as f:
    content = f.read()

# Add KDSTicketData import if missing
if 'KDSTicketData' not in content[:500]:
    content = content.replace('import { KDSTicket } from "@/components/kitchen/KDSTicket";', 
        'import { KDSTicket } from "@/components/kitchen/KDSTicket";\nimport type { KDSTicketData } from "@/types/domain";')
    # Or just replace the imports block:
    content = content.replace('import React, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport type { KDSTicketData } from "@/types/domain";')

# group is of type unknown
content = content.replace('Object.values(sessionGroups).sort((a, b) => {', 'Object.values(sessionGroups).sort((a: any, b: any) => {')
content = content.replace('Object.values(sessionGroups).filter((group) => {', 'Object.values(sessionGroups).filter((group: any) => {')
content = content.replace('groupOrders.map((order) =>', 'groupOrders.map((order: any) =>')
content = content.replace('groupOrders.map(order =>', 'groupOrders.map((order: any) =>')
content = content.replace('group.some(o =>', 'group.some((o: any) =>')
content = content.replace('groupOrders[0]', '(groupOrders as any)[0]')
content = content.replace('orders={groupOrders}', 'orders={groupOrders as any}')
content = content.replace('o.order_items.map((i) =>', 'o.order_items.map((i: any) =>')
content = content.replace('a.map(o =>', 'a.map((o: any) =>')
content = content.replace('b.map(o =>', 'b.map((o: any) =>')

with open('src/components/kitchen/KDSBoard.tsx', 'w') as f:
    f.write(content)

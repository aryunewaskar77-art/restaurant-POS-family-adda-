import re

with open('src/components/admin/MenuManagerClient.tsx', 'r') as f:
    content = f.read()

content = content.replace('setCategories((prev) => [...prev, result.category as Category]);', 'setCategories((prev: any) => [...prev, result.category as Category]);')

if 'const [categories, setCategories]' not in content and 'const [localCategories, setCategories]' not in content:
    content = content.replace('export function MenuManagerClient({ categories, menuItems: initialItems, isEditUnlocked }: MenuManagerProps) {', 'export function MenuManagerClient({ categories: initialCategories, menuItems: initialItems, isEditUnlocked }: MenuManagerProps) {\n  const [categories, setCategories] = useState<Category[]>(initialCategories);')

with open('src/components/admin/MenuManagerClient.tsx', 'w') as f:
    f.write(content)

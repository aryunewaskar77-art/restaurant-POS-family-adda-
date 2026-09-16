import TableQRGenerator from '@/components/admin/TableQRGenerator';

export default function QRPage() {
  return (
    <main className="max-w-6xl mx-auto py-6">
      <TableQRGenerator totalTables={10} />
    </main>
  );
}

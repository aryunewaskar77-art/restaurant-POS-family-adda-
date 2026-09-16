'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface TableQR {
  tableNumber: string | number;
  qrDataUrl: string;
  url: string;
}

export default function TableQRGenerator({ totalTables = 20 }: { totalTables?: number }) {
  const [tables, setTables] = useState<TableQR[]>([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Detect host origin dynamically in the browser
    const origin = window.location.origin;
    Promise.resolve().then(() => setBaseUrl(origin));

    async function generateQRCodes() {
      const generated: TableQR[] = [];
      for (let i = 1; i <= totalTables; i++) {
        const tableUrl = `${origin}/order/${i}`;
        const dataUrl = await QRCode.toDataURL(tableUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'H', // High error correction to allow logo overlay
          color: {
            dark: '#14532d', // Brand dark green (tailwind brand-900)
            light: '#ffffff',
          },
        });

        generated.push({
          tableNumber: i,
          qrDataUrl: dataUrl,
          url: tableUrl,
        });
      }
      setTables(generated);
    }

    generateQRCodes();
  }, [totalTables]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Table QR Cards</h2>
          <p className="text-sm text-slate-500">Base target: {baseUrl}/order/[tableNumber]</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded shadow transition-all"
        >
          Print All Cards
        </button>
      </div>

      {/* Printable Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4">
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            className="border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm print:shadow-none print:border-black print:break-inside-avoid"
          >
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Family Adda
            </span>
            <span className="text-2xl font-black text-brand-700 mb-2">
              Table {table.tableNumber}
            </span>
            <div className="relative w-44 h-44 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={table.qrDataUrl}
                alt={`QR for Table ${table.tableNumber}`}
                className="w-full h-full rounded-lg"
              />
              {/* Overlay Logo in Center */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-white"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">Scan to order & pay</p>
          </div>
        ))}
      </div>
    </div>
  );
}
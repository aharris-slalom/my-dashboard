import { useState } from 'react';
import { FileText, Download, Calendar, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';

const reports = [
  {
    title: 'Monthly Cold-Chain Integrity Report',
    description: 'Comprehensive analysis of thermal stability across all units',
    date: 'May 2026',
    icon: FileText,
  },
  {
    title: 'Quarterly Inventory Valuation',
    description: 'Asset valuation and depreciation analysis',
    date: 'Q2 2026',
    icon: Calendar,
  },
  {
    title: 'Incident Log: May 2026',
    description: 'Documented temperature excursions and resolutions',
    date: 'Current Month',
    icon: AlertTriangle,
  },
];

export default function ReportsSection() {
  const { departments, totalValueAtRisk, isAuditMode } = useDashboard();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('North Dallas Medical Center', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(16);
    doc.text('Cold-Chain Audit Package', pageWidth / 2, 45, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });

    // Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit Summary', 20, 80);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Value at Risk: $${totalValueAtRisk.toLocaleString()}`, 20, 95);
    doc.text(`Audit Mode: ${isAuditMode ? 'Enabled' : 'Disabled'}`, 20, 105);

    // Units Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Unit Status Report', 20, 125);

    let yPos = 140;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Unit Name', 20, yPos);
    doc.text('Department', 80, yPos);
    doc.text('Status', 130, yPos);
    doc.text('Last Audit', 170, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');

    departments.forEach(dept => {
      dept.units.forEach(unit => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(unit.unitName, 20, yPos);
        doc.text(dept.name, 80, yPos);
        doc.text(unit.status, 130, yPos);
        doc.text(unit.last_audit_passed ? 'Passed' : 'Failed', 170, yPos);
        yPos += 8;
      });
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This document is confidential and intended for regulatory compliance purposes only.', 20, pageHeight - 10);

    doc.save('cold-chain-audit-package.pdf');
    setGenerating(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Reports Vault</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Compliance Documentation</h2>
        </div>
        <button
          type="button"
          onClick={generatePDF}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-3xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {generating ? 'Generating...' : 'Generate PDF Audit Package'}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4 transition hover:bg-slate-900/90"
            >
              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className="h-6 w-6 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{report.title}</p>
                <p className="text-sm text-slate-400">{report.description}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{report.date}</p>
              </div>
              <button
                type="button"
                className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/20"
              >
                View
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, CurrencyCode } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const exportTransactionsToPdf = (
  transactions: Transaction[],
  userName: string,
  currency: CurrencyCode,
  timeRangeTitle: string = 'Financial Statement Report'
) => {
  const doc = new jsPDF();

  // Color theme: Bento Obsidian Header
  doc.setFillColor(10, 10, 14);
  doc.rect(0, 0, 210, 42, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AURA FINANCE PRO', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 255, 0); // Electric Lime
  doc.text('BENTO GRID WEALTH & CAPITAL AUDIT', 14, 30);

  // Meta information
  doc.setTextColor(180, 185, 200);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated For: ${userName}`, 130, 18);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 24);
  doc.text(`Scope: ${timeRangeTitle}`, 130, 30);

  // Summary Metrics Calculation
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Summary Cards Bar (Frosted Bento style)
  doc.setFillColor(242, 244, 250);
  doc.roundedRect(14, 48, 182, 28, 4, 4, 'F');

  // Total Income (Electric Lime / Obsidian)
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 130);
  doc.text('TOTAL INFLOW', 22, 57);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`+${formatCurrency(totalIncome, currency)}`, 22, 68);

  // Total Expense (Iris Violet)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 110, 130);
  doc.text('TOTAL OUTFLOW', 85, 57);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text(`-${formatCurrency(totalExpense, currency)}`, 85, 68);

  // Net Cash Flow
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 110, 130);
  doc.text('NET CAPITAL RETAINED', 148, 57);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(netSavings >= 0 ? 15 : 219, netSavings >= 0 ? 23 : 39, netSavings >= 0 ? 42 : 119);
  doc.text(formatCurrency(netSavings, currency), 148, 68);

  // Transactions Table
  const tableData = transactions.map(t => [
    formatDate(t.date),
    t.description,
    t.categoryName,
    t.paymentMethod,
    t.type.toUpperCase(),
    `${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount, currency)}`,
  ]);

  autoTable(doc, {
    startY: 84,
    head: [['Date', 'Description', 'Category', 'Method', 'Type', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [10, 10, 14],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      5: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: data => {
      // Footer
      const str = `Page ${doc.getNumberOfPages()} • Aura Finance Pro Bento Architecture`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, 14, doc.internal.pageSize.height - 10);
    },
  });

  doc.save(`Aura_Bento_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
};

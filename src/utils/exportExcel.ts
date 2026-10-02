import * as XLSX from 'xlsx';
import { Transaction } from '../types';

export const exportTransactionsToExcel = (transactions: Transaction[], filename = 'Aura_Transactions') => {
  const data = transactions.map(t => ({
    'Transaction ID': t.id,
    'Date': t.date,
    'Description': t.description,
    'Category': t.categoryName,
    'Type': t.type.toUpperCase(),
    'Amount': t.amount,
    'Payment Method': t.paymentMethod,
    'Tags': t.tags.join(', '),
    'Location': t.location || 'N/A',
    'Notes': t.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Column width auto-adjustment
  const max_width = [15, 12, 35, 20, 10, 12, 18, 20, 20, 25];
  worksheet['!cols'] = max_width.map(w => ({ wch: w }));

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportTransactionsToCsv = (transactions: Transaction[], filename = 'Aura_Transactions') => {
  const data = transactions.map(t => ({
    'Date': t.date,
    'Description': `"${t.description.replace(/"/g, '""')}"`,
    'Category': `"${t.categoryName}"`,
    'Type': t.type,
    'Amount': t.amount,
    'Payment Method': `"${t.paymentMethod}"`,
    'Tags': `"${t.tags.join(';')}"`,
    'Notes': `"${(t.notes || '').replace(/"/g, '""')}"`,
  }));

  if (data.length === 0) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

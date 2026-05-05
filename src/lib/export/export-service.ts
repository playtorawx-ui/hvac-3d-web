import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { HVACSystem } from '../types/hvac';
import { runDiagnostics } from '../diagnostics/hvac-diagnostics';

export async function exportSystemAsPDF(system: HVACSystem): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 10;

  // Title
  doc.setFontSize(20);
  doc.text('HVAC System Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // System Info
  doc.setFontSize(12);
  doc.text(`System Name: ${system.name}`, 10, yPosition);
  yPosition += 7;
  doc.text(`Refrigerant: ${system.refrigerant}`, 10, yPosition);
  yPosition += 7;
  doc.text(`Created: ${new Date(system.createdAt).toLocaleDateString()}`, 10, yPosition);
  yPosition += 10;

  // Components Section
  doc.setFontSize(14);
  doc.text('Components', 10, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  system.components.forEach((component) => {
    doc.text(`• ${component.name} (${component.type})`, 15, yPosition);
    yPosition += 5;
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 10;
    }
  });

  yPosition += 5;

  // Connections Section
  doc.setFontSize(14);
  doc.text('Connections', 10, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  system.connections.forEach((connection) => {
    const fromComponent = system.components.find((c) => c.id === connection.fromComponentId);
    const toComponent = system.components.find((c) => c.id === connection.toComponentId);
    if (fromComponent && toComponent) {
      doc.text(`• ${fromComponent.name} → ${toComponent.name}`, 15, yPosition);
      yPosition += 5;
    }
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 10;
    }
  });

  // Diagnostics Section
  yPosition += 5;
  const report = runDiagnostics(system);

  doc.setFontSize(14);
  doc.text('System Diagnostics', 10, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.text(`Overall Health: ${report.overallHealth.toUpperCase()} (${report.score}/100)`, 10, yPosition);
  yPosition += 7;

  if (report.issues.length > 0) {
    doc.text('Issues:', 10, yPosition);
    yPosition += 5;
    report.issues.forEach((issue) => {
      doc.text(`• ${issue.title}: ${issue.description}`, 15, yPosition);
      yPosition += 5;
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 10;
      }
    });
  } else {
    doc.text('No issues found. System is operating normally.', 10, yPosition);
  }

  return doc.output('blob');
}

export async function generateQRCode(system: HVACSystem): Promise<string> {
  const data = JSON.stringify({
    id: system.id,
    name: system.name,
    refrigerant: system.refrigerant,
    components: system.components.length,
    connections: system.connections.length,
  });

  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}

export function generateEmailContent(system: HVACSystem): { subject: string; body: string } {
  const report = runDiagnostics(system);

  const subject = `HVAC System Report: ${system.name}`;

  const body = `
HVAC System Report

System Name: ${system.name}
Refrigerant: ${system.refrigerant}
Components: ${system.components.length}
Connections: ${system.connections.length}
Created: ${new Date(system.createdAt).toLocaleDateString()}

System Health: ${report.overallHealth.toUpperCase()} (${report.score}/100)

Components:
${system.components.map((c) => `- ${c.name} (${c.type})`).join('\n')}

Connections:
${system.connections
  .map((conn) => {
    const from = system.components.find((c) => c.id === conn.fromComponentId);
    const to = system.components.find((c) => c.id === conn.toComponentId);
    return `- ${from?.name || 'Unknown'} → ${to?.name || 'Unknown'}`;
  })
  .join('\n')}

Diagnostics:
${
  report.issues.length === 0
    ? 'No issues found. System is operating normally.'
    : report.issues
        .map((issue) => `- [${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}`)
        .join('\n')
}

---
Generated on ${new Date().toLocaleString()}
  `.trim();

  return { subject, body };
}

export async function downloadFile(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

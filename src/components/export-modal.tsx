import { useState } from 'react';
import { HVACSystem } from '../lib/types/hvac';
import { exportSystemAsPDF, generateQRCode, generateEmailContent, downloadFile } from '../lib/export/export-service';

interface ExportModalProps {
  system: HVACSystem;
  onClose: () => void;
}

export function ExportModal({ system, onClose }: ExportModalProps) {
  const [exporting, setExporting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const blob = await exportSystemAsPDF(system);
      await downloadFile(blob, `${system.name}-report.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateQR = async () => {
    setExporting(true);
    try {
      const qr = await generateQRCode(system);
      setQrCode(qr);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCode) return;
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      await downloadFile(blob, `${system.name}-qr.png`);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code');
    }
  };

  const handleSendEmail = () => {
    const { subject, body } = generateEmailContent(system);
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4 space-y-4 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-foreground">Export System</h2>

        {/* PDF Export */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Export as PDF</h3>
          <p className="text-xs text-muted mb-3">Download a detailed PDF report of your system</p>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>

        {/* QR Code */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Generate QR Code</h3>
          <p className="text-xs text-muted mb-3">Create a QR code to share your system</p>
          {!qrCode ? (
            <button
              onClick={handleGenerateQR}
              disabled={exporting}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {exporting ? 'Generating...' : 'Generate QR Code'}
            </button>
          ) : (
            <div className="space-y-2">
              <img src={qrCode} alt="QR Code" className="w-full" />
              <button
                onClick={handleDownloadQR}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Send via Email</h3>
          <p className="text-xs text-muted mb-3">Share your system details via email</p>
          <input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendEmail}
            disabled={!emailTo}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            Send Email
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

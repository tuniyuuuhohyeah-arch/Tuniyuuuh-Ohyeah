import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  ShieldCheck,
  Calendar,
  User,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  employeeName?: string;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  employeeName,
  onClose,
  onDownload,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!document) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isImage = document.fileType === 'jpg' || document.fileType === 'png';
  const isSvg = document.dataUrl?.startsWith('data:image/svg+xml');
  const isDocx = document.fileType === 'docx';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 bg-slate-800 rounded-md text-blue-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate text-white">
                {document.documentTitle}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {document.fileName} · {document.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Button */}
            <button
              onClick={() => onDownload(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors"
              title="Download file to computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors ml-2"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar for Viewer */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-700">
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-sm">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors ml-2"
              title="Rotate 90 Degrees"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors ml-1"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Attested Civil Service Record</span>
            </span>
            <span>Security Classification: Confidential (RA 10173)</span>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-200/70 p-6 flex items-center justify-center">
          <div
            className="transition-transform duration-150 origin-center max-w-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            {document.dataUrl ? (
              isImage || isSvg ? (
                <div className="bg-white shadow-lg rounded-sm p-2 max-w-2xl border border-slate-300">
                  <img
                    src={document.dataUrl}
                    alt={document.documentTitle}
                    className="max-h-[68vh] w-auto object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : document.fileType === 'pdf' ? (
                // PDF Document preview
                <div className="bg-white shadow-xl rounded-sm p-4 w-[650px] min-h-[800px] border border-slate-300 flex flex-col justify-between">
                  <div className="border-b border-slate-200 pb-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Republic of the Philippines
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          Civil Service 201 Document
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-mono text-slate-500">
                        File: {document.fileName}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {document.documentTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Personnel: {employeeName || 'Subject Employee'} · ID: {document.employeeId}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 max-w-md bg-slate-50 p-3 rounded-md border border-slate-200">
                      Standard PDF attachment archived in the 201 Personnel Repository. Click "Download File" to view the complete multi-page document in your local PDF reader.
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex justify-between">
                    <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                    <span>Custodian: {document.uploadedBy}</span>
                  </div>
                </div>
              ) : (
                // DOCX or other
                <div className="bg-white shadow-xl rounded-sm p-8 w-[600px] min-h-[500px] border border-slate-300 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-lg">
                    DOCX
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{document.documentTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1">{document.fileName}</p>
                  </div>
                  <p className="text-xs text-slate-600 max-w-sm">
                    Microsoft Word document attached to 201 file. Download the file to edit or open in Microsoft Word or LibreOffice.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-white shadow-md p-8 rounded-md text-center max-w-md">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Preview Not Cached</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Click the Download button above to retrieve the archived binary copy.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <span>Size: <strong className="font-mono text-slate-800">{formatFileSize(document.fileSize)}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Uploaded: <strong className="font-mono text-slate-800">{new Date(document.uploadDate).toLocaleString()}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>By: <strong className="text-slate-800">{document.uploadedBy}</strong></span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Record ID: <span className="font-mono">{document.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

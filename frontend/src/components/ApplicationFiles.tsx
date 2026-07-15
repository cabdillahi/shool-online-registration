import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import { getUploadUrl, isImageFile, isPdfFile } from "../lib/uploads";
import { cn } from "../lib/utils";

interface ApplicationFilesProps {
  photoUrl?: string | null;
  documentUrl?: string | null;
  className?: string;
  /** Compact chips for tables */
  compact?: boolean;
}

const ApplicationFiles: React.FC<ApplicationFilesProps> = ({
  photoUrl,
  documentUrl,
  className,
  compact = false,
}) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const photo = getUploadUrl(photoUrl);
  const document = getUploadUrl(documentUrl);
  const documentIsImage = isImageFile(documentUrl);
  const documentIsPdf = isPdfFile(documentUrl);

  if (!photo && !document) {
    if (compact) {
      return (
        <span className="text-xs text-muted-foreground">No files</span>
      );
    }
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500",
          className
        )}
      >
        No files uploaded with this application
      </div>
    );
  }

  const openLightbox = (src: string, title: string) => {
    setLightboxSrc(src);
    setLightboxTitle(title);
  };

  if (compact) {
    return (
      <>
        <div className={cn("flex items-center gap-2", className)}>
          {photo && (
            <button
              type="button"
              onClick={() => openLightbox(photo, "Student photo")}
              className="relative group"
              title="View photo"
            >
              <img
                src={photo}
                alt="Photo"
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <span className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                <ZoomIn className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100" />
              </span>
            </button>
          )}
          {document && (
            documentIsImage ? (
              <button
                type="button"
                onClick={() => openLightbox(document, "Document")}
                className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-slate-200"
                title="View document"
              >
                <img
                  src={document}
                  alt="Document"
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <a
                href={document}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100 hover:bg-emerald-100"
                title="Open document"
              >
                <FileText className="h-4 w-4" />
              </a>
            )
          )}
        </div>
        <Lightbox
          src={lightboxSrc}
          title={lightboxTitle}
          onClose={() => setLightboxSrc(null)}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-emerald-600" />
          Uploaded files
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {photo && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              <button
                type="button"
                className="block w-full relative group"
                onClick={() => openLightbox(photo, "Student photo")}
              >
                <img
                  src={photo}
                  alt="Student photo"
                  className="w-full h-40 object-cover"
                />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow">
                    <ZoomIn className="h-3.5 w-3.5" />
                    View full size
                  </span>
                </span>
              </button>
              <div className="p-2.5 flex items-center justify-between gap-2 bg-slate-50 border-t">
                <span className="text-xs font-medium">Student photo</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 rounded-lg"
                    onClick={() => openLightbox(photo, "Student photo")}
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 rounded-lg" asChild>
                    <a href={photo} target="_blank" rel="noreferrer" download>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {document && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              {documentIsImage ? (
                <button
                  type="button"
                  className="block w-full relative group"
                  onClick={() => openLightbox(document, "Supporting document")}
                >
                  <img
                    src={document}
                    alt="Document"
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow">
                      <ZoomIn className="h-3.5 w-3.5" />
                      View full size
                    </span>
                  </span>
                </button>
              ) : documentIsPdf ? (
                <div className="h-40 bg-slate-50 flex flex-col items-center justify-center gap-2 p-4">
                  <FileText className="h-10 w-10 text-emerald-600" />
                  <p className="text-xs text-slate-500">PDF document</p>
                  <Button size="sm" className="rounded-full h-8" asChild>
                    <a href={document} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Open PDF
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="h-40 bg-slate-50 flex flex-col items-center justify-center gap-2 p-4">
                  <FileText className="h-10 w-10 text-emerald-600" />
                  <Button size="sm" className="rounded-full h-8" asChild>
                    <a href={document} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Open file
                    </a>
                  </Button>
                </div>
              )}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-slate-50 border-t">
                <span className="text-xs font-medium">Supporting document</span>
                <div className="flex items-center gap-1">
                  {documentIsImage && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 rounded-lg"
                      onClick={() =>
                        openLightbox(document, "Supporting document")
                      }
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 px-2 rounded-lg" asChild>
                    <a href={document} target="_blank" rel="noreferrer">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        src={lightboxSrc}
        title={lightboxTitle}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
};

function Lightbox({
  src,
  title,
  onClose,
}: {
  src: string | null;
  title: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 text-white">
              <p className="font-medium text-sm">{title}</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full h-8"
                  asChild
                >
                  <a href={src} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Open
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-8 w-8"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <img
              src={src}
              alt={title}
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded-xl object-contain bg-black/20"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ApplicationFiles;

import { useState } from "react";
import { motion } from "motion/react";
import { Upload, FileCheck, ShieldCheck, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface VerificationPageProps {
  role: "school" | "ngo_business";
  onComplete: (data: any) => void;
}

export default function VerificationPage({ role, onComplete }: VerificationPageProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ngoDocs = [
    { id: "registration", label: "Proof of Registration", description: "Official registration certificate as an NGO/NPO or certified company.", icon: FileCheck, optional: false },
    { id: "legal", label: "Legal Documents", description: "Constitution or founding documents of the organization.", icon: ShieldCheck, optional: false },
    { id: "id_director", label: "ID/Passport of Director", description: "Identification document of the organization's director or owner.", icon: UserCircle, optional: false },
    { id: "proof_ops", label: "Proof of Operations", description: "Evidence of past work (photos, reports, social media links).", icon: Globe, optional: false },
    { id: "programs", label: "List of Programs", description: "Detailed list of your current initiatives or distribution programs.", icon: ListChecks, optional: false },
    { id: "safety", label: "Product Safety Assurance", description: "Information & proof that products meet basic health & safety standards.", icon: ShieldCheck, optional: false },
    { id: "reference", label: "Partnership/Reference Letters (Optional)", description: "Letters from schools or communities you've worked with.", icon: FileText, optional: true },
  ];

  const schoolDocs = [
    { id: "school_admin", label: "Proof of Administration", description: "Official certificate or EMIS number document.", icon: FileCheck, optional: false },
    { id: "rep_id", label: "ID/Passport of Representative", description: "Identification document of the school representative or headmaster.", icon: UserCircle, optional: false },
    { id: "rep_employment", label: "Proof of Employment", description: "Official letter or document confirming representative's employment at the school.", icon: ShieldCheck, optional: false },
  ];

  const requiredDocs = role === "school" ? schoolDocs : ngoDocs;

  const handleFileChange = (id: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // In a real app, we would upload to Firebase Storage here
    // For now, we'll just pass the file names/metadata
    const verificationData = Object.entries(files).reduce((acc, [key, file]) => {
      const f = file as File | null;
      if (f) {
        acc[key] = {
          name: f.name,
          size: f.size,
          type: f.type,
          uploadedAt: new Date().toISOString()
        };
      }
      return acc;
    }, {} as Record<string, any>);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    onComplete(verificationData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-radiant-bg flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-radiant-pink rounded-full flex items-center justify-center text-white mb-8 shadow-xl"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-4xl font-serif mb-4">Verification Pending</h2>
        <p className="text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
          Your documents have been successfully uploaded. Our team will review them and verify your organization within 2-3 business days. You'll receive an email once the process is complete.
        </p>
        <div className="w-full max-w-xs space-y-4">
          <p className="text-sm text-gray-400 italic">Please sign in to complete your registration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-radiant-bg px-6 py-16 flex flex-col">
      <div className="max-w-2xl mx-auto w-full space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-radiant-pink/10 text-radiant-pink rounded-2xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-5xl font-serif">Organization Verification</h1>
          <p className="text-gray-500 max-w-md mx-auto italic">
            To ensure the safety and integrity of our community, we verify all NGO and Business partners.
          </p>
        </header>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-black/5 space-y-10">
          <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
            <Info className="text-blue-500 shrink-0 mt-1" size={20} />
            <p className="text-sm text-blue-700 leading-relaxed">
              Please upload clear, legible copies of the following documents. Supported formats: PDF, JPG, PNG (Max 10MB per file).
            </p>
          </div>

          <div className="space-y-8">
            {requiredDocs.map((doc) => (
              <div key={doc.id} className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div>
                    <h3 className="font-serif text-xl">{doc.label} {doc.optional && <span className="text-sm text-gray-400 font-sans italic">(Optional)</span>}</h3>
                    <p className="text-sm text-gray-400">{doc.description}</p>
                  </div>
                </div>
                <label className={cn(
                  "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[32px] transition-all cursor-pointer group",
                  files[doc.id] ? "border-radiant-pink bg-radiant-pink/5" : "border-gray-200 hover:border-radiant-pink/30 hover:bg-gray-50"
                )}>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                  />
                  {files[doc.id] ? (
                    <div className="flex items-center gap-3 text-radiant-pink">
                      <FileCheck size={24} />
                      <span className="font-medium truncate max-w-[200px]">{files[doc.id]?.name}</span>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleFileChange(doc.id, null); }}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-radiant-pink transition-colors">
                      <Upload size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest">Click to Upload</span>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || requiredDocs.filter(d => !d.optional).some(d => !files[d.id])}
            className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Uploading...
              </>
            ) : (
              <>
                Submit for Verification
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { User as UserCircle, Globe, FileText, ListChecks } from "lucide-react";

"use client";
// ─────────────────────────────────────────────────────────
// src/app/admin/apply/components/ApplyClient.tsx
// ─────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DocTypeTabs } from "./DocTypeTabs";
import { StyleGallery } from "./StyleGallery";
import { JobForm } from "./JobForm";
import { OutputEditor } from "./OutputEditor";
import { SectionLabel } from "./SectionLabel";
import { AtsPanel } from "./AtsPanel";
import { HistoryStrip } from "./HistoryStrip";
import { useApplyForm, useGenerate, useHistory } from "../hooks/useApply";

export function ApplyClient() {
  const form = useApplyForm();
  const gen = useGenerate();
  const history = useHistory();

  const handleGenerate = async () => {
    await gen.generate(form.toPayload());
  };

  const handleReset = () => {
    gen.reset();
    form.resetForm();
  };

  const handleSelectHistory = (row: {
    content: string;
    doc_type: string;
    company_name?: string | null;
    role_name?: string | null;
  }) => {
    gen.setOutput(row.content);
    if (
      ["cover_letter", "proposal", "cold_dm", "ats_resume"].includes(
        row.doc_type
      )
    ) {
      form.setDocType(row.doc_type as typeof form.docType);
    }
    if (row.company_name) form.setCompanyName(row.company_name);
    if (row.role_name) form.setRoleName(row.role_name);
    toast.success("Loaded from history");
  };

  return (
    <div className="max-w-2xl space-y-12 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="font-mono text-xs text-muted-foreground">
            Admin only — not linked publicly
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Apply Studio
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Grounded in your portfolio data — letters read the live site, the
            ATS resume reads the database. Export to PDF/DOC or create a share
            link when you&apos;re ready to send.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <SectionLabel
            step="01"
            label="What are you writing?"
            description="Choose the type of document you need."
          />
          <DocTypeTabs value={form.docType} onChange={form.setDocType} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <SectionLabel
            step="02"
            label="Pick a style"
            description="This shapes the entire tone and structure of the output."
          />
          <StyleGallery value={form.style} onChange={form.setStyle} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <SectionLabel
            step="03"
            label="Paste the job description"
            description="The AI reads your portfolio live and writes around what it finds."
          />
          <JobForm
            docType={form.docType}
            jobDescription={form.jobDescription}
            companyName={form.companyName}
            roleName={form.roleName}
            isValid={form.isValid}
            isLoading={gen.status === "loading"}
            onJobDescriptionChange={form.setJobDescription}
            onCompanyNameChange={form.setCompanyName}
            onRoleNameChange={form.setRoleName}
            onSubmit={handleGenerate}
          />
        </motion.div>

        <AnimatePresence>
          {gen.status === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2.5 px-4 py-3 rounded-xs bg-destructive/10 border border-destructive/30"
          >
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Generation failed</p>
              <p className="text-xs text-destructive/80 mt-0.5">{gen.errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gen.status === "success" && gen.output && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SectionLabel
                step="04"
                label="Your document"
                description="Edit directly. Flagged phrases are AI-sounding — rewrite those before sending."
              />
              <OutputEditor
                output={gen.output}
                onChange={gen.setOutput}
                onReset={handleReset}
                docType={form.docType}
                style={form.style}
                companyName={form.companyName}
                roleName={form.roleName}
                jobDescription={form.jobDescription}
                onShared={history.refresh}
              />
              {form.docType === "ats_resume" && (
                <div className="mt-4">
                  <AtsPanel
                    output={gen.output}
                    jobDescription={form.jobDescription}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <HistoryStrip
            rows={history.rows}
            loading={history.loading}
            onSelect={handleSelectHistory}
            onDelete={history.remove}
          />
        </motion.div>

      </div>
  );
}

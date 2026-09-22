"use client";
// ─────────────────────────────────────────────────────────
// src/app/apply/components/ApplyClient.tsx
// ─────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { DocTypeTabs } from "./DocTypeTabs";
import { StyleGallery } from "./StyleGallery";
import { JobForm } from "./JobForm";
import { OutputEditor } from "./OutputEditor";
import { SectionLabel } from "./SectionLabel";
import { useApplyForm, useGenerate } from "../hooks/useApply";

export function ApplyClient() {
  const form = useApplyForm();
  const gen = useGenerate();

  const handleGenerate = async () => {
    await gen.generate(form.toPayload());
  };

  const handleReset = () => {
    gen.reset();
    form.resetForm();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 px-4 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto space-y-12">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            Private — Yabets only
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Job Application AI
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-lg">
            Reads your live portfolio at{" "}
            <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
              yabetskifle.vercel.app
            </span>{" "}
            and generates documents in your actual voice. Nothing hardcoded — updates automatically when your site updates.
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
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Generation failed</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{gen.errorMsg}</p>
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
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

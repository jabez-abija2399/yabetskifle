"use client";
// ─────────────────────────────────────────────────────────
// src/app/admin/apply/hooks/useApply.ts
// ─────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from "react";
import type {
  DocType,
  StyleKey,
  GenerationStatus,
  GeneratePayload,
  ShareRecord,
} from "../types";

export function useApplyForm() {
  const [docType, setDocType] = useState<DocType>("cover_letter");
  const [style, setStyle] = useState<StyleKey>("punchy");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");

  const isValid = jobDescription.trim().length > 20;

  const resetForm = useCallback(() => {
    setJobDescription("");
    setCompanyName("");
    setRoleName("");
  }, []);

  const toPayload = useCallback(
    (): GeneratePayload => ({
      docType,
      style,
      jobDescription,
      companyName,
      roleName,
    }),
    [docType, style, jobDescription, companyName, roleName]
  );

  return {
    docType, setDocType,
    style, setStyle,
    jobDescription, setJobDescription,
    companyName, setCompanyName,
    roleName, setRoleName,
    isValid,
    resetForm,
    toPayload,
  };
}

export function useGenerate() {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = useCallback(async (payload: GeneratePayload) => {
    setStatus("loading");
    setOutput("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      setOutput(data.output);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
  }, []);

  return { output, setOutput, status, errorMsg, generate, reset };
}

export function useHistory() {
  const [rows, setRows] = useState<ShareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/apply/share");
      const data = await res.json();
      if (!res.ok) {
        setRows([]);
        setError(data.error ?? "Failed to load history");
      } else {
        setRows(data.rows ?? []);
        setError("");
      }
    } catch {
      setRows([]);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // refresh() awaits the network before any setState — nothing sync here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      await fetch(`/api/apply/share?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setRows((prev) => prev.filter((r) => r.id !== id));
    },
    []
  );

  return { rows, loading, error, refresh, remove };
}

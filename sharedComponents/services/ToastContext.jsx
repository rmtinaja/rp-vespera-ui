"use client";

import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";
import { showCustom } from "@/sharedComponents/components/CustomToast";

const ToastContext = createContext(null);

// global bridge
let toastApi = null;

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const show = (options) => showCustom(toastRef, options);

  const success = (summary, detail = "", options = {}) =>
    show({ severity: "success", summary, detail, ...options });

  const error = (summary, detail = "", options = {}) =>
    show({ severity: "error", summary, detail, ...options });

  const warn = (summary, detail = "", options = {}) =>
    show({ severity: "warn", summary, detail, ...options });

  const info = (summary, detail = "", options = {}) =>
    show({ severity: "info", summary, detail, ...options });

  const clear = () => toastRef.current?.clear();

  const value = { show, success, error, warn, info, clear };

  // make available outside hooks
  toastApi = value;

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// simple callable helpers
export const toastSuccess = (summary, detail = "", options = {}) =>
  toastApi?.success(summary, detail, options);

export const toastError = (summary, detail = "", options = {}) =>
  toastApi?.error(summary, detail, options);

export const toastWarn = (summary, detail = "", options = {}) =>
  toastApi?.warn(summary, detail, options);

export const toastInfo = (summary, detail = "", options = {}) =>
  toastApi?.info(summary, detail, options);

export const toastClear = () => toastApi?.clear();
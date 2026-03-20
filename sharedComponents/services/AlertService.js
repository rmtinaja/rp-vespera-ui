// sharedComponents/services/AlertService.js
let toastRef = null;

export const setToast = (ref) => {
  toastRef = ref;
};

export const show = (severity, message, options = {}) => {
  if (!toastRef) {
    console.warn("Toast not initialized yet!");
    return;
  }

  toastRef.show({
    severity,
    summary: severity.toUpperCase(),
    detail: message,
    life: 2500,
    closable: true,
  });

  if (options.redirect) {
    setTimeout(() => {
      window.location.href = options.redirect;
    }, 2500);
  }

  if (options.refresh) {
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  }
};

export const alert = {
  success: (message, options = {}) => show("success", message, options),
  error: (message, options = {}) => show("error", message, options),
  warn: (message, options = {}) => show("warn", message, options),
  info: (message, options = {}) => show("info", message, options),
};
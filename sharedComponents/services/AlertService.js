let toastRef = null;
let routerRef = null;
export const setToast = (ref) => {
    toastRef = ref;
};
export const setRouter = (router) => {
    routerRef = router;
};
const show = (severity, message, options = {}) => {
    if (!toastRef) return;
    toastRef.show({
        severity,
        summary: severity.toUpperCase(),
        detail: message,
        life: 2500
    });
    if (options.redirect && routerRef) {
        setTimeout(() => {
            routerRef.push(options.redirect);
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
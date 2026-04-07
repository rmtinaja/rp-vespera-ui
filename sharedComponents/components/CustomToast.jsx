import React from "react";
import "../../app/globals.scss";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

const LIFE = { success: 3500, error: 5000, warn: 3500, info: 3500 };

const ICONS = {
  success: <CircleCheck size={24} />,
  error: <CircleX size={24} />,
  warn: <CircleAlert size={24} />,
  info: <Info size={24} />,
};

export const ToastContent = ({ message }) => {
  const { severity = "info", summary, detail, life, sticky } = message;
  const duration = life ?? LIFE[severity] ?? 3500;

  return (
    <div
      className={`ct-toast w-full ct-${severity}`}
      style={{ alignItems: "center" }}
    >
      <span className={`ct-icon ct-icon-${severity}`}>{ICONS[severity]}</span>

      <div className="ct-body">
        {summary && <p className="ct-summary">{summary}</p>}
        {detail && <p className="ct-detail">{detail}</p>}
      </div>

      {!sticky && (
        <div className="ct-progress">
          <div
            className={`ct-bar ct-bar-${severity}`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export const showCustom = (toastRef, options) => {
  const { severity = "info", life, sticky, ...rest } = options;
  const duration = life ?? LIFE[severity] ?? 3500;

  toastRef.current?.show({
    severity,
    life: sticky ? undefined : duration,
    sticky: sticky ?? false,
    content: (props) => (
      <ToastContent message={{ severity, life: duration, sticky, ...rest }} />
    ),
    ...rest,
  });
};

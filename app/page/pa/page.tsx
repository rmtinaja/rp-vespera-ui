'use client';

import { useRef } from "react";
// import CustomerReg from "./CustomerReg";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
export default function Form() {
  const toast = useRef<Toast>(null);

  const show = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  return (
    <div>
      <h2>LSP Page</h2>

      <Toast ref={toast} />

      <Button onClick={show} label="Basic" />
      asd
    </div>
  );
}
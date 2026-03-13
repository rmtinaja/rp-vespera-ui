import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";
import { setToast } from "../services/AlertService";

export default function GlobalToast(){

    const toast = useRef(null);

    useEffect(()=>{
        setToast(toast.current);
    },[]);

    return <Toast ref={toast} position="top-right" />;
}
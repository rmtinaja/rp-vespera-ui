"use client";

import { Toast } from "primereact/toast";
import { useRef, useEffect, ReactNode } from "react";
import { setToast } from "@/sharedComponents/services/AlertService";
import NavigationProvider from "./NavigationProvider";

export default function Providers({ children }: { children: ReactNode }) {

    const toast = useRef(null);

    useEffect(()=>{
        if(toast.current){
            setToast(toast.current);
        }
    },[]);

    return (
        <>
            <Toast ref={toast} position="top-right"/>
            <NavigationProvider />
            {children}
        </>
    );
}
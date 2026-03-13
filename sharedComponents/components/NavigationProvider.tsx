"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setRouter } from "@/sharedComponents/services/AlertService";

export default function NavigationProvider(){

    const router = useRouter();

    useEffect(()=>{
        setRouter(router);
    },[router]);

    return null;
}
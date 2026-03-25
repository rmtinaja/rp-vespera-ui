import { ReactNode } from "react";

type EstateLayoutProps = {
    children: ReactNode;
};

export default function Estate({ children }: EstateLayoutProps) {
    return <div>{children}</div>;
}
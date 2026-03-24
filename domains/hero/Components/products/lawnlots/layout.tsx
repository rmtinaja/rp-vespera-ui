import { ReactNode } from "react";

type LawnsLayoutProps = {
    children: ReactNode;
};

export default function LawnsLayout({ children }: LawnsLayoutProps) {
    return <div>{children}</div>;
}
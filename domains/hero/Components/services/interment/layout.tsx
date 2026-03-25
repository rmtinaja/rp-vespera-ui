import { ReactNode } from "react";

type IntermentLayoutProps = {
    children: ReactNode;
};

export default function Interment({ children }: IntermentLayoutProps) {
    return <div>{children}</div>;
}
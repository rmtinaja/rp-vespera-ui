import { ReactNode } from "react";

type CommunityVaultLayoutProps = {
    children: ReactNode;
};

export default function CommunityVaults({ children }: CommunityVaultLayoutProps) {
    return <div>{children}</div>;
}
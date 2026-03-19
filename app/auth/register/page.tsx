import RegisterLayout from "@/domains/buyerreg/Components/layout";
import BuyerRegister from "@/domains/buyerreg/Components/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration - Renaissance Park",
  description: "Renaissance Park Registration",
  icons: {
    icon: "/assets/images/logo.png",
  },
};
export default function RegisterPage() {
  return (
    <RegisterLayout>
      <BuyerRegister />
    </RegisterLayout>
  );
}

import type { Metadata } from "next";
import LoginUserComponent from "@/domains/auth/Components/LoginComponent";

export const metadata: Metadata = {
  title: "Login - Renaissance Park",
  description: "Login to your account",
};

export default function Page() {
  return <LoginUserComponent />;
}
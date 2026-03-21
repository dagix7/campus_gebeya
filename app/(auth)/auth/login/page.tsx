import { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your CampusGebeya account to buy, sell, and trade with fellow students.",
  openGraph: {
    title: "Sign In | CampusGebeya",
    description: "Sign in to your CampusGebeya account to buy, sell, and trade with fellow students.",
  },
}

export default function LoginPage() {
  return <LoginForm />
}

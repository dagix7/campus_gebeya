import { Metadata } from "next"
import SignupForm from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join CampusGebeya - the student marketplace for Ethiopian university students. Create your account to start buying and selling.",
  openGraph: {
    title: "Create Account | CampusGebeya",
    description: "Join CampusGebeya - the student marketplace for Ethiopian university students.",
  },
}

export default function SignupPage() {
  return <SignupForm />
}

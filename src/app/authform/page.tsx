import Link from "next/link";
import AuthForm from "../components/auth-form";

export default function AuthFormPage() {
  return (
    <section>
      <div>
        <h1>Hello, Auth Page!</h1>
        <Link href="/">Home</Link>
      </div>
      <AuthForm />
    </section>
  );
}

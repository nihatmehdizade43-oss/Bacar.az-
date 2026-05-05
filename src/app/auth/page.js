// Purpose: Redirect legacy /auth route to the main /login page.
import { redirect } from "next/navigation";

export default function AuthPage() {
  redirect("/login");
}

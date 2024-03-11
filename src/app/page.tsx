import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignOutButton from "@/client/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <h1>Home</h1>
      <p>Olá: {session?.user.email}</p>
      <SignOutButton />
    </main>
  );
}



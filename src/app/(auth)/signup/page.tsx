import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PersonIcon } from "@radix-ui/react-icons"
import SignupForm from "@/client/components/signup/SignupForm"

export default function Component() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Inversio</h1>
        <p className="mt-2 text-lg">Crie uma conta</p>
      </div>
      <div className="mt-8">
        <Avatar>
          <AvatarFallback className="bg-inherit">
            <PersonIcon className="text-primary h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>
      <SignupForm />
      <div className="mt-4 flex flex-col items-center">
        <Link className="text-sm text-blue-600 hover:underline" href="/signin">
          Já tem uma conta? Faça login
        </Link>
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-gray-500">
        © 2024 Inversio Ltda. Todos direitos reservados.
      </footer>
    </div>
  )
}


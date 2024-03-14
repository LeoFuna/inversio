import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { LockClosedIcon } from "@radix-ui/react-icons"
import SigninForm from "@/client/components/signin/SigninForm"

export default function Signin() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Inversio</h1>
        <p className="mt-2 text-lg">Acesse sua conta</p>
      </div>
      <div className="mt-8">
        <Avatar>
          <AvatarFallback className="bg-inherit">
            <LockClosedIcon className="text-primary h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>
      <SigninForm />
      <div className="mt-4 text-center text-sm">
        <Link className="underline" href="#">
          Esqueceu a senha?
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <Link className="text-sm text-blue-600 hover:underline" href="/signup">
          Não tem conta? Cadastre-se
        </Link>
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-gray-500">
        © 2024 Inversio Ltda. Todos direitos reservados.
      </footer>
    </div>
  )
}


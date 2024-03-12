import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PersonIcon } from "@radix-ui/react-icons"

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
      <form className="mt-6 w-full max-w-xs">
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="username">
            Nome de usuário
            <Input className="mt-1" id="username" placeholder="Seu nome de usuário" type="text" />
          </label>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
            <Input className="mt-1" id="email" placeholder="m@example.com" type="email" />
          </label>
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Senha
            <Input className="mt-1" id="password" placeholder="********" type="password" />
          </label>
          <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
            Confirmar Senha
            <Input className="mt-1" id="confirm-password" placeholder="********" type="password" />
          </label>
          <Button className="mt-4 bg-blue-600 text-white">Cadastrar</Button>
        </div>
      </form>
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


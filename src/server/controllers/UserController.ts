import { NextRequest, NextResponse } from "next/server";
import { IUserController } from "../interfaces/user/IUserController";
import { IUserService } from "../interfaces/user/IUserService";
import { IUser } from "../domains/User";

export class UserController implements IUserController {
  constructor(private readonly userService: IUserService) {}

  async checkUserCredentials(req: NextRequest) {
    const body: { password: string, email: string } = await req.json();
    if (!body.email.length || !body.password.length) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 401 }
      );
    }

    try {
      const checkResponse = await this.userService.checkUserCredentials(body.email, body.password);

      if ('error' in checkResponse) {
        return NextResponse.json(
          { message: checkResponse.error },
          { status: checkResponse.status }
        );
      }
      return NextResponse.json(
        { email: checkResponse.email },
        { status: 200 }
      );
    } catch (e: any) {
      // TO DO: o erro aqui seria mais o caso de erro inesperado, ou seja
      // qqr erro esperado, deve ser tratado!
      return NextResponse.json(null, { status: 500 });
    }
  };

  async createUser(req: NextRequest) {
    try {
      const body: IUser = await req.json();
      const user = await this.userService.createUser(body);
      if ('error' in user) {
        return NextResponse.json(
          { message: user.error },
          { status: user.status }  
        )
      }
      return NextResponse.json(
        { email: user.email },
        { status: 201 }
      );
    } catch (e: any) {
      return NextResponse.json(null, { status: 500 });
    }
  };
  
}
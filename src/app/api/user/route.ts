import { UserController } from "@/server/controllers/UserController";
import { UserRepoLocal } from "@/server/repositories/UserRepoLocal";
import { UserService } from "@/server/services/UserService";
import { NextRequest } from "next/server";

const userController = new UserController(new UserService(new UserRepoLocal()))

export async function POST(request: NextRequest) {  
  return userController.createUser(request);
}
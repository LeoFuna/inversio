import { signupSchema } from "@/schemas/user-schemas"
import { z } from "zod"

type UserType = Omit<z.infer<typeof signupSchema>, 'confirmPassword'>

export interface IUser extends UserType {}

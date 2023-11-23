import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
  });


  export const signUpSchema = loginSchema
  .extend({
    userName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3).max(30),
  });

  export const updateUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3).max(30),
  })

export type ILogin = z.infer<typeof loginSchema>;
export type IUpdateUser = z.infer<typeof updateUserSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
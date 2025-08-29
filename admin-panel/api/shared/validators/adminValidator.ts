import z from "zod";

export const adminLoginBody = z.object({
  userName: z.string(),
  password: z.string(),
});

export const adminLoginResponse = z.object({
  token: z.string(),
  data: z.object({
    userEmail: z.string().optional(),
    userName: z.string(),
  }),
});

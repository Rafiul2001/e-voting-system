import z from "zod";

export const Admin = z.object({
    adminName: z.string(),
    adminPassword: z.string()
})

export type TAdmin = z.infer<typeof Admin>
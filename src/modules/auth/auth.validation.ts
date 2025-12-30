// import { z } from "zod";

// export const registerSchema = z.object({
//   body: z.object({
//     email: z.email("Invalid email format"),
//     password: z.string().min(8, "Password must be at least 6 characters"),
//     role: z.enum(["owner", "staff"]).optional(),
//   }),
// });

// export const loginSchema = z.object({
//   body: z.object({
//     email: z.email(),
//     password: z.string().min(8),
//   }),
// });
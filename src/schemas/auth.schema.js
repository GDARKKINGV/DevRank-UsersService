import { z } from "zod";

export const registerSchema = z.object({
  userName: z
    .string({
      required_error: "User name is required",
    })
    .min(6, {
      message: "User name must be at least 6 characters",
    }),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(4, {
      message: "Name must be at least 4 characters",
    }),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(4, {
      message: "Last name must be at least 4 characters",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

export const loginSchema = z.object({
  userName: z
    .string({
      required_error: "User name is required",
    })
    .min(6, {
      message: "User name must be at least 6 characters",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

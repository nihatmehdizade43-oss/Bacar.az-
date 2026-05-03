// Purpose: Centralized Zod schemas for client and API validation.
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ad minimum 2 simvol olmalıdır."),
  email: z.email("Düzgün email daxil edin."),
  password: z.string().min(8, "Şifrə minimum 8 simvol olmalıdır."),
});

export const loginSchema = z.object({
  email: z.email("Düzgün email daxil edin."),
  password: z.string().min(8, "Şifrə minimum 8 simvol olmalıdır."),
});

export const jobSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(3000),
  category: z.string().min(2).max(50),
  budget: z.number().int().positive(),
  deadlineDays: z.number().int().min(1).max(365),
  status: z.enum(["active", "closed"]).default("active"),
});

export const applicationSchema = z.object({
  message: z.string().min(10).max(1000),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  message: z.string().min(10).max(2000),
});

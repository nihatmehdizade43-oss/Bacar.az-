// Purpose: Contact endpoint with server-side validation.
import { contactSchema } from "@/lib/validations";
import { fail, handleApiError, ok } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    return ok(
      {
        accepted: true,
        receivedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

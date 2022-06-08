import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "@/backend/router";

export const trpc = createReactQueryHooks<AppRouter>();

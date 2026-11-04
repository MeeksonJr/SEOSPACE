import React, { Suspense } from "react";
import { AuthSplitScreen } from "@/components/auth/AuthSplitScreen";

export const metadata = {
  title: "Verify Your Email | Seospace AI",
  description:
    "Confirm your email address to activate your Seospace AI website audit workspace and agency white-label reports.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center text-ink text-sm font-mono">
          Loading verification console...
        </div>
      }
    >
      <AuthSplitScreen initialMode="verify" />
    </Suspense>
  );
}

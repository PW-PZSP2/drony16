import { ChangePasswordForm } from "../components/feature/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 -translate-y-12">
      <div className="flex w-full max-w-md flex-col">
        <a href="/" className="flex items-center justify-center -mb-8">
          <img
            src="/images/logo.png"
            alt="Droneo"
            className="h-48 object-contain translate-x-2"
          />
        </a>
        <div>
          <div className="bg-background rounded-lg border p-6 shadow-sm">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { AuthService } from "@/services/authorization_service"
import HorizontalRadio from "../../base/HorizontalRadio/HorizontalRadio"
import {useState} from "react";
import { CircleCheck } from "lucide-react"

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Nazwa użytkownika jest wymagana.")
    .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki.")
    .max(20, "Nazwa użytkownika może mieć maksymalnie 20 znaków."),
  email: z.string().min(1, "Email jest wymagany.").email("Wprowadź prawidłowy adres email."),
  password: z.string().min(1, "Hasło jest wymagane.").min(6, "Hasło musi mieć co najmniej 6 znaków."),
  confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne.",
  path: ["confirmPassword"],
})


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof registerSchema>) {
    console.log("Register:", data)
    // TODO: Call AuthService.register
  }

  return (
    <form 
      {...props}
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >

      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Utwórz konto</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Wypełnij poniższe pola, aby utworzyć nowe konto
          </p>
        </div>
        <HorizontalRadio options={[{label: "Operator", value: "operator"}, {label: "Klient", value: "client"}]}></HorizontalRadio>  
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-username">Nazwa użytkownika</FieldLabel>
              <Input 
                {...field}
                id="register-username" 
                type="text" 
                placeholder="jan_kowalski"
                aria-invalid={fieldState.invalid}
                autoComplete="username"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input 
                {...field}
                id="register-email" 
                type="email" 
                placeholder="jan@example.com"
                aria-invalid={fieldState.invalid}
                autoComplete="email"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password">Hasło</FieldLabel>
              <Input 
                {...field}
                id="register-password" 
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-confirmPassword">Potwierdź hasło</FieldLabel>
              <Input 
                {...field}
                id="register-confirmPassword" 
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit">Zarejestruj się</Button>
        </Field>
        <FieldSeparator>Lub kontynuuj z</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Zarejestruj przez GitHub
          </Button>
          <FieldDescription className="text-center">
            Masz już konto?{" "}
            <a href="?action=login" className="underline underline-offset-4">
              Zaloguj się
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
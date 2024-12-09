import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/states/auth-state";

// Validation schema for registration form
const registerFormSchema = z
  .object({
    username: z.string().min(1, "Введите имя пользователя."),
    password: z.string().min(1, "Введите пароль."),
    confirmPassword: z.string().min(1, "Подтвердите пароль."),
    name: z.string().min(1, "Введите ваше имя."),
    email: z.string().email("Неверный формат электронной почты").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm({ className }: React.ComponentProps<"form">) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails, signUpUser, isLoading } = useAuthStore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signUpUser({
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
      });
      toast.success("Регистрация успешна!");
      const query = new URLSearchParams(location.search);
      const callbackUrl = query.get("callbackUrl");
      navigate(callbackUrl || "/login");
    } catch (error) {
      toast.error("Ошибка регистрации");
    }
  };

  React.useEffect(() => {
    if (userDetails) {
      const query = new URLSearchParams(location.search);
      const callbackUrl = query.get("callbackUrl");
      navigate(callbackUrl || "/");
    }
  }, [userDetails, navigate, location.search]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="user1917" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ваше имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Зарегистрироваться"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              ИЛИ
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/login")}>
          Уже есть аккаунт? Войти
        </Button>
      </form>
    </Form>
  );
}

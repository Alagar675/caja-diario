
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Por favor, ingrese su nombre." }),
  email: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signup(values.name, values.email, values.password);
      toast.success('Registro exitoso! Redirigiendo al inicio de sesión...');
      navigate('/login');
    } catch (error: any) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppLayout showSidebar={false}>
        <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Crear una cuenta</CardTitle>
                <CardDescription>
                  Ingrese sus datos para registrarse.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    type="text"
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name?.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    placeholder="ejemplo@correo.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="password"
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password?.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  className="w-full" 
                  disabled={isSubmitting} 
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
                <p className="text-sm text-center">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default Register;

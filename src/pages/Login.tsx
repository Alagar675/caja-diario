
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

const Login = () => {
  const { login } = useAuth();
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
      await login(values.email, values.password);
      toast.success('Inicio de sesión exitoso! Redirigiendo al panel de control...');
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Error al iniciar sesión: ${error.message || 'Credenciales inválidas.'}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout showSidebar={false}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full flex justify-center items-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                  Ingresa tus credenciales para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
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
                    type="password" 
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
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                <p className="text-sm text-center">
                  ¿No tienes una cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default Login;

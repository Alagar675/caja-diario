
import React, { useState } from "react";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

const verificationSchema = z.object({
  code: z.string().length(6, { message: "El código debe tener 6 dígitos" }),
});

const Login = () => {
  const { login, verifyCode } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const userEmail = await login(values.email, values.password);
      setEmail(userEmail);
      setIsVerifying(true);
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  const onVerifySubmit = async (values: z.infer<typeof verificationSchema>) => {
    try {
      await verifyCode(email, values.code);
      toast.success('Verificación exitosa! Redirigiendo al panel de control...');
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout showSidebar={false}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full flex justify-center items-center">
            <Card className="w-full max-w-md">
              {!isVerifying ? (
                <>
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
                        {...loginForm.register("email")} 
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.email?.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        {...loginForm.register("password")} 
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.password?.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={loginForm.handleSubmit(onLoginSubmit)}
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                    <p className="text-sm text-center">
                      ¿No tienes una cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
                    </p>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Verificación</CardTitle>
                    <CardDescription className="text-center">
                      Ingresa el código de verificación enviado a tu correo electrónico
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Código de verificación</Label>
                      <div className="flex justify-center py-4">
                        <InputOTP maxLength={6} {...verificationForm.register("code")}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {verificationForm.formState.errors.code && (
                        <p className="text-sm text-red-500 text-center">{verificationForm.formState.errors.code?.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={verificationForm.handleSubmit(onVerifySubmit)}
                      disabled={verificationForm.formState.isSubmitting}
                    >
                      {verificationForm.formState.isSubmitting ? "Verificando..." : "Verificar Código"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setIsVerifying(false)}
                    >
                      Volver
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default Login;

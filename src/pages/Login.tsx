
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
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
import LoginFormFields from "@/components/auth/LoginFormFields";
import VerificationFormFields from "@/components/auth/VerificationFormFields";

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
                  <CardContent>
                    <LoginFormFields form={loginForm} />
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
                  <CardContent>
                    <VerificationFormFields form={verificationForm} />
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

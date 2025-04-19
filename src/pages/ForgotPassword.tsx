
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Key } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido" }),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      // En una aplicación real, aquí enviarías una solicitud a tu API para enviar el correo de restablecimiento
      // Simulamos una solicitud exitosa después de 1 segundo
      setTimeout(() => {
        toast.success("Se ha enviado un correo de recuperación a tu dirección de email", {
          description: "Revisa tu bandeja de entrada y sigue las instrucciones"
        });
        setIsSubmitted(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      toast.error("Error al procesar la solicitud");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout showSidebar={false}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full flex justify-center items-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Recuperar contraseña</CardTitle>
                <CardDescription className="text-center">
                  Ingresa tu correo electrónico para recibir un enlace de recuperación
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar correo de recuperación"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Correo enviado con éxito
                          </p>
                          <p className="mt-2 text-sm text-green-700">
                            Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.
                            Por favor revisa tu bandeja de entrada.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Enviar nuevamente
                    </Button>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Volver a iniciar sesión
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default ForgotPassword;

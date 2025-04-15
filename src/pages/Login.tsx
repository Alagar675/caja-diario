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
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <AppLayout showSidebar={false}>
        <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  <Input id="email" type="email" placeholder="ejemplo@correo.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full">Iniciar Sesión</Button>
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

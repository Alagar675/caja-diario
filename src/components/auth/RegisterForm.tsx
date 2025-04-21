
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
      toast.success("Usuario registrado exitosamente");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "user_already_exists") {
        toast.error("Este email ya está registrado. Intente iniciar sesión.");
      } else {
        toast.error(error.message || "Error al registrarse");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass card-shadow animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Crear una cuenta</CardTitle>
        <CardDescription className="text-center">
          Ingrese sus datos para registrarse en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/login")}
          className="text-sm hover:text-primary"
        >
          ¿Ya tiene una cuenta? Iniciar sesión
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;

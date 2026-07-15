"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { getErrorMessage } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function setDemoAdminSession() {
  document.cookie = "demo_admin_session=true; path=/";
}

export default function AdminLogin() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isDemoMode = !hasSupabaseConfig || supabaseUrl.includes("placeholder");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isDemoMode) {
        // In Demo Mode, simulate a successful login and save a cookie/session marker
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDemoAdminSession();
        router.push("/admin");
        router.refresh();
      } else {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          router.push("/admin");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setValue("email", "asfan@example.com");
    setValue("password", "password123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8 bg-muted/20 border border-border p-8 md:p-12 rounded-[2rem] shadow-sm">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-olive text-warm-ivory">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-deep-olive">
              Hijama by Shanu
            </h1>
            <p className="text-xs uppercase tracking-widest text-muted-gold font-semibold">
              Admin Portal Login
            </p>
          </div>
        </div>

        {/* Demo Mode Alert Banner */}
        {isDemoMode && (
          <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4 text-xs space-y-2 text-amber-800">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <span>Preview / Demo Mode</span>
            </div>
            <p className="leading-relaxed">
              Supabase keys are currently placeholders. You can log in using any email and password, or click the autofill button below.
            </p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDemoFill}
              className="w-full h-8 text-[11px] font-bold border-amber-300 hover:bg-amber-100/50 text-amber-800 bg-transparent rounded-lg"
            >
              Autofill Demo Credentials
            </Button>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-2.5 text-xs font-bold text-destructive">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="admin@example.com"
              type="email"
              className="rounded-xl h-11 bg-background"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-bold text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="rounded-xl h-11 bg-background pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-bold text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </Button>
        </form>

      </div>
    </div>
  );
}

import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 rounded-full border-8 border-primary/20 bg-primary/10 p-4">
              <Icons.logo className="h-12 w-auto text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              FireResponse
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your station's dashboard
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

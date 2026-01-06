import { SignupForm } from '@/components/auth/signup-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 rounded-full border-8 border-primary/20 bg-primary/10 p-4">
              <Icons.logo className="h-12 w-auto text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create an Account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Register your station personnel for service access.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>New User Registration</CardTitle>
                <CardDescription>
                  Complete the form below. Your application will be sent to an administrator for approval.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

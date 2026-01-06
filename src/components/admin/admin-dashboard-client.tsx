import { ApprovalTable } from './approval-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboardClient() {
  return (
    <div className="container py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage user registrations and system settings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Pending User Registrations</CardTitle>
                <CardDescription>
                    Review the applications below to approve or reject new user access.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ApprovalTable />
            </CardContent>
        </Card>
    </div>
  );
}

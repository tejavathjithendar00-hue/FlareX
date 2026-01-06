'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pendingUsersData, type PendingUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export function ApprovalTable() {
  const [users, setUsers] = useState<PendingUser[]>(pendingUsersData);
  const { toast } = useToast();

  const handleAction = (userId: string, action: 'approve' | 'reject') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Mock sending email to user
    console.log(`Simulating sending ${action} email to ${user.email}...`);
    
    // In a real app, this would be an API call
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));

    toast({
      title: `User ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `${user.name}'s application has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

  const pendingUsers = users.filter(user => user.status === 'pending');

  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Vehicle No.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pendingUsers.length > 0 ? (
                pendingUsers.map(user => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                        <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span>{user.mobile}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary">{user.vehicleNumber}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="hidden items-center justify-end gap-2 sm:flex">
                             <Button variant="outline" size="sm" asChild>
                                <a href={user.documentUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-3 w-3" />
                                    Docs
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleAction(user.id, 'reject')}>
                                <X className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleAction(user.id, 'approve')}>
                                <Check className="mr-2 h-4 w-4" /> Approve
                            </Button>
                        </div>
                        <div className="sm:hidden">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <a href={user.documentUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" /> View Docs
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-green-600 focus:text-green-600" onClick={() => handleAction(user.id, 'approve')}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleAction(user.id, 'reject')}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    No pending registrations.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );
}

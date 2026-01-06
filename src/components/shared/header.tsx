'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFireData } from '@/hooks/use-fire-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Siren, User as UserIcon, LogOut } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function Header() {
  const { user, logout } = useAuth();
  const { isFireDetected, toggleFire } = useFireData();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">FireResponse</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <Siren className={`h-5 w-5 ${isFireDetected ? 'text-destructive' : 'text-muted-foreground'}`} />
            <Label htmlFor="fire-simulation-switch" className="text-sm font-medium">Simulate Fire</Label>
            <Switch id="fire-simulation-switch" checked={isFireDetected} onCheckedChange={toggleFire} />
          </div>
          <nav className="flex items-center space-x-2">
            {user && (
              <>
                <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === 'admin' && (
                      <DropdownMenuItem disabled>
                        <Shield className="mr-2" />
                        <span>Admin Role</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <UserIcon className="mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

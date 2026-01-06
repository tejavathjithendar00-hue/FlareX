'use client';
import { useFireData } from '@/hooks/use-fire-data';
import { DataChart } from './data-chart';
import { HistoricalData } from './historical-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, History } from 'lucide-react';

export function DashboardClient() {
  const { fireData, isFireDetected } = useFireData();

  return (
    <div className="container py-8">
      <Tabs defaultValue="live">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Station Dashboard</h1>
            <TabsList>
                <TabsTrigger value="live"><Activity className="mr-2"/>Live Feed</TabsTrigger>
                <TabsTrigger value="historical"><History className="mr-2"/>Historical Data</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="live" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Live Temperature Feed</CardTitle>
                    <CardDescription>
                        Displaying real-time sensor data, updating every 2 seconds.
                        <span className={`ml-2 font-semibold ${isFireDetected ? 'text-destructive' : 'text-green-600'}`}>
                            Status: {isFireDetected ? 'FIRE DETECTED' : 'Normal'}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataChart data={fireData} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="historical" className="mt-6">
            <HistoricalData />
        </TabsContent>
      </Tabs>
    </div>
  );
}

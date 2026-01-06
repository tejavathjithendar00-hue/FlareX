'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function GPSLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(`Error: ${err.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    const intervalId = setInterval(fetchLocation, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live GPS Location</CardTitle>
        <CardDescription>
          Real-time GPS coordinates of the monitoring station or vehicle, refreshing automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6">
          {loading && !location ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Fetching GPS coordinates...</p>
            </>
          ) : error ? (
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button onClick={fetchLocation} variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          ) : location ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Location:</p>
              <div className='flex items-center gap-4'>
                <p className="text-2xl font-bold">
                  Lat: {location.latitude.toFixed(6)}
                </p>
                <p className="text-2xl font-bold">
                  Lon: {location.longitude.toFixed(6)}
                </p>
                {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              </div>
            </div>
          ) : (
             <p className="text-muted-foreground">Could not retrieve location.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

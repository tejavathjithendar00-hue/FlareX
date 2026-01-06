'use client';

import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataChart } from './data-chart';
import { generateHistoricalData, type TemperatureData } from '@/lib/data';

export function HistoricalData() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [historicalData, setHistoricalData] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (date) {
      setLoading(true);
      // Simulate fetching data for the selected date
      setTimeout(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0,0,0,0);
        const diffDays = Math.round((today.getTime() - selectedDate.getTime()) / (1000 * 3600 * 24));
        
        setHistoricalData(generateHistoricalData(diffDays));
        setLoading(false);
      }, 500);
    }
  }, [date]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Historical Temperature Data</CardTitle>
            <CardDescription>Review temperature logs from previous days.</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => day > new Date() || day < new Date('2020-01-01')}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex h-[400px] w-full items-center justify-center">
                <p className="text-muted-foreground">Loading data for {date ? format(date, 'PPP') : ''}...</p>
            </div>
        ) : (
            <DataChart data={historicalData} />
        )}
      </CardContent>
    </Card>
  );
}

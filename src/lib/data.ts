export type PendingUser = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  vehicleNumber: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
};

export const pendingUsersData: PendingUser[] = [];

export type TemperatureData = {
  time: string;
  temperature: number;
};

export const generateHistoricalData = (dayOffset: number): TemperatureData[] => {
  const data: TemperatureData[] = [];
  const now = new Date();
  now.setDate(now.getDate() - dayOffset);

  for (let i = 0; i < 24; i++) {
    now.setHours(i, 0, 0, 0);
    const temperature = Math.floor(Math.random() * 15) + 20; // Normal temperature range 20-35
    data.push({
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature,
    });
  }
  return data;
};

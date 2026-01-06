export type PendingUser = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  vehicleNumber: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
};

export const pendingUsersData: PendingUser[] = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '1234567890',
    email: 'john.doe@example.com',
    vehicleNumber: 'TS07AB1234',
    documentUrl: 'https://example.com/doc1',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '0987654321',
    email: 'jane.smith@example.com',
    vehicleNumber: 'AP09CD5678',
    documentUrl: 'https://example.com/doc2',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Peter Jones',
    mobile: '1122334455',
    email: 'peter.jones@example.com',
    vehicleNumber: 'KA01EF9012',
    documentUrl: 'https://example.com/doc3',
    status: 'pending',
  },
    {
    id: '4',
    name: 'Emily White',
    mobile: '5566778899',
    email: 'emily.white@example.com',
    vehicleNumber: 'MH12DE3456',
    documentUrl: 'https://example.com/doc4',
    status: 'pending',
  },
];

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

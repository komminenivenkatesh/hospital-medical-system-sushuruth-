import {
  Box, Grid, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';

const data = [
  { month: 'Jul', clinic: 12000, video: 8000, mri: 3000 },
  { month: 'Aug', clinic: 14000, video: 9000, mri: 4000 },
  { month: 'Sep', clinic: 13000, video: 7500, mri: 3500 },
  { month: 'Oct', clinic: 16000, video: 11000, mri: 5000 },
  { month: 'Nov', clinic: 15000, video: 10000, mri: 4500 },
  { month: 'Dec', clinic: 18000, video: 12000, mri: 6000 },
];
const txns = [
  { date: 'Dec 15', patient: 'M****a S.', type: 'Video', gross: 600, commission: 90, net: 510 },
  { date: 'Dec 14', patient: 'R****n S.', type: 'In-Clinic', gross: 800, commission: 120, net: 680 },
  { date: 'Dec 13', patient: 'A****a I.', type: 'MRI Review', gross: 500, commission: 75, net: 425 },
  { date: 'Dec 12', patient: 'V****m N.', type: 'Video', gross: 600, commission: 90, net: 510 },
];

export default function Earnings() {
  return (
    <PageTransition>
      <PageHeader title="Earnings" subtitle="Your consultation revenue and payouts" right={<Button variant="outlined">Export</Button>} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Gross" value="₹98,000" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Commission" value="₹14,700" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="TDS" value="₹4,900" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Net Payout" value="₹78,400" statusText="Paid" statusColor="#10B981" /></Grid>
      </Grid>

      <Card sx={{ mb: 2 }}><CardContent>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Revenue by source</Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Manrope' }} />
            <Legend wrapperStyle={{ fontFamily: 'Manrope', fontSize: 12 }} />
            <Bar dataKey="clinic" stackId="a" fill="#2563EB" name="In-Clinic" radius={[0, 0, 0, 0]} />
            <Bar dataKey="video" stackId="a" fill="#93C5FD" name="Video" />
            <Bar dataKey="mri" stackId="a" fill="#14B8A6" name="MRI Reviews" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent></Card>

      <Card><CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead><TableRow>
            {['Date', 'Patient', 'Type', 'Gross', 'Commission', 'Net'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 700, color: '#6B7280', fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow></TableHead>
          <TableBody>
            {txns.map((t, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontSize: 13 }}>{t.date}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{t.patient}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{t.type}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>₹{t.gross}</TableCell>
                <TableCell sx={{ fontSize: 13, color: '#EF4444' }}>-₹{t.commission}</TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>₹{t.net}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </PageTransition>
  );
}

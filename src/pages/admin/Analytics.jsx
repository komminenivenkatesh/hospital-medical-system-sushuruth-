import { Grid, Card, CardContent, Typography } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';

const growth = [
  { m: 'Jul', v: 32000 }, { m: 'Aug', v: 35000 }, { m: 'Sep', v: 38000 },
  { m: 'Oct', v: 42000 }, { m: 'Nov', v: 45000 }, { m: 'Dec', v: 48210 },
];
const specialties = [
  { name: 'Neurology', v: 320 }, { name: 'Cardiology', v: 280 }, { name: 'General', v: 410 },
  { name: 'Pediatrics', v: 190 }, { name: 'Dermatology', v: 150 },
];

export default function Analytics() {
  return (
    <PageTransition>
      <PageHeader title="Analytics" subtitle="Growth and engagement across the platform" />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Monthly Active Users" value={48210} animate /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Avg. Session" value="6m 12s" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Retention" value="72%" statusText="+4%" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><MetricCard label="Pro Conversion" value="11%" statusText="+1.2%" /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card><CardContent>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>User Growth</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={growth}>
                <defs />
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Manrope' }} />
                <Area type="monotone" dataKey="v" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card><CardContent>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Appointments by Specialty</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={specialties} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Manrope' }} />
                <Bar dataKey="v" fill="#2563EB" radius={[0, 4, 4, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </PageTransition>
  );
}

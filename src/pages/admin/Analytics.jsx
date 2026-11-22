import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';
import { adminAPI } from '../../services/api';

const defaultGrowth = [
  { m: 'Jul', v: 32000 }, { m: 'Aug', v: 35000 }, { m: 'Sep', v: 38000 },
  { m: 'Oct', v: 42000 }, { m: 'Nov', v: 45000 }, { m: 'Dec', v: 48210 },
];

const defaultSpecialties = [
  { name: 'Neurology', v: 320 }, { name: 'Cardiology', v: 280 }, { name: 'General', v: 410 },
  { name: 'Pediatrics', v: 190 }, { name: 'Dermatology', v: 150 },
];

export default function Analytics() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    monthlyActiveUsers: 48210,
    avgSession: '6m 12s',
    retention: '74%',
    proConversion: '12.4%',
  });
  const [growth, setGrowth] = useState(defaultGrowth);
  const [specialties, setSpecialties] = useState(defaultSpecialties);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAnalytics()
      .then(({ data }) => {
        if (data) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.growth && data.growth.length > 0) setGrowth(data.growth);
          if (data.specialties && data.specialties.length > 0) setSpecialties(data.specialties);
        }
      })
      .catch((err) => console.warn('Could not load admin analytics:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader title="Analytics" subtitle="Growth, specialty engagement, and clinical platform metrics" />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Monthly Active Users" value={metrics.monthlyActiveUsers} animate />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Avg. Session" value={metrics.avgSession} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Retention" value={metrics.retention} statusText="+4%" statusColor="#10B981" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Pro Conversion" value={metrics.proConversion} statusText="+1.2%" statusColor="#2563EB" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>User Growth Trend</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Manrope' }} />
                  <Area type="monotone" dataKey="v" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2.5} name="Users" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Consultations by Specialty</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={specialties} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Manrope' }} />
                  <Bar dataKey="v" fill="#2563EB" radius={[0, 4, 4, 0]} name="Consultations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageTransition>
  );
}

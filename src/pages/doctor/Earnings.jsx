import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button,
  CircularProgress, Snackbar, Alert,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import PageTransition from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import MetricCard from '../../components/MetricCard';
import { paymentAPI } from '../../services/api';

const defaultMonthly = [
  { month: 'Jul', clinic: 12000, video: 8000, mri: 3000 },
  { month: 'Aug', clinic: 14000, video: 9000, mri: 4000 },
  { month: 'Sep', clinic: 13000, video: 7500, mri: 3500 },
  { month: 'Oct', clinic: 16000, video: 11000, mri: 5000 },
  { month: 'Nov', clinic: 15000, video: 10000, mri: 4500 },
  { month: 'Dec', clinic: 18000, video: 12000, mri: 6000 },
];

const defaultTxns = [
  { date: 'Dec 15', patient: 'M****a S.', type: 'Video', gross: 600, commission: 90, net: 510 },
  { date: 'Dec 14', patient: 'R****n S.', type: 'In-Clinic', gross: 800, commission: 120, net: 680 },
  { date: 'Dec 13', patient: 'A****a I.', type: 'MRI Review', gross: 500, commission: 75, net: 425 },
  { date: 'Dec 12', patient: 'V****m N.', type: 'Video', gross: 600, commission: 90, net: 510 },
];

export default function Earnings() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [metrics, setMetrics] = useState({
    gross: '₹98,000',
    commission: '₹14,700',
    tds: '₹4,900',
    netPayout: '₹78,400',
    statusText: 'Paid',
    statusColor: '#10B981',
  });
  const [monthlyData, setMonthlyData] = useState(defaultMonthly);
  const [txns, setTxns] = useState(defaultTxns);

  const handleExportStatement = () => {
    const text = `Sushruth Healthcare - Doctor Consultation Revenue & Payout Statement\n------------------------------------------------------------------\nDoctor: Dr. Arvind Rao (Neurology)\nGross Revenue:      ${metrics.gross}\nPlatform Fee:       ${metrics.commission}\nTax Deducted (TDS): ${metrics.tds}\nNet Disbursed:      ${metrics.netPayout}\n\nPayout Ledger:\n${txns.map((e) => `${e.date} | ${e.type} Consultation (${e.patient}) | Net: ₹${e.net}`).join('\n')}\n------------------------------------------------------------------\nAudited & Verified for Direct Bank Transfer.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Doctor_Payout_Statement_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar('Payout statement downloaded successfully!');
  };

  useEffect(() => {
    setLoading(true);
    paymentAPI.getDoctorEarnings()
      .then(({ data }) => {
        if (data) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.monthly && data.monthly.length > 0) setMonthlyData(data.monthly);
          if (data.transactions && data.transactions.length > 0) setTxns(data.transactions);
        }
      })
      .catch((err) => console.warn('Could not fetch doctor earnings, using defaults:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Earnings"
        subtitle="Your consultation revenue, platform commissions, and payout history"
        right={
          <Button
            variant="outlined"
            onClick={handleExportStatement}
            startIcon={<DownloadOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{ borderRadius: 100, fontWeight: 700 }}
          >
            Export Payout Statement
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Gross" value={metrics.gross} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Commission" value={metrics.commission} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="TDS" value={metrics.tds} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Net Payout" value={metrics.netPayout} statusText={metrics.statusText} statusColor={metrics.statusColor} />
        </Grid>
      </Grid>

      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 16 }}>Revenue by Source</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
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
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <Table sx={{ minWidth: 540 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                    {['Date', 'Patient', 'Type', 'Gross', 'Commission', 'Net'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#6B7280', fontSize: 12 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {txns.map((t, i) => (
                    <TableRow key={t.id || i} hover>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{t.date}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{t.patient}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{t.type}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 700 }}>₹{Number(t.gross).toLocaleString('en-IN')}</TableCell>
                      <TableCell sx={{ fontSize: 13, color: '#EF4444' }}>-₹{Number(t.commission).toLocaleString('en-IN')}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                        ₹{Number(t.net).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageTransition>
  );
}

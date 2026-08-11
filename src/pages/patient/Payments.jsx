import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Button, Stack, Chip, Avatar,
  Divider, IconButton,
} from '@mui/material';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PageTransition from '../../components/PageTransition';
import { PillTabs } from '../../components/SectionCard';
import SectionCard from '../../components/SectionCard';
import { tokens } from '../../theme/theme';
import useStore from '../../store/useStore';

const transactions = [
  { id: 't1', doctor: 'Dr. Arvind Rao', specialty: 'Neurology', type: 'Video Consultation', amount: 600, date: '5 Jun 2026', time: '11:00 AM', status: 'Completed', method: 'UPI' },
  { id: 't2', doctor: 'Dr. Priya Mehta', specialty: 'Cardiology', type: 'In-Clinic Visit', amount: 900, date: '28 May 2026', time: '2:30 PM', status: 'Completed', method: 'Card' },
  { id: 't3', doctor: 'Sushruth Pro', specialty: 'Subscription', type: 'Monthly Plan', amount: 299, date: '1 Jun 2026', time: '12:00 AM', status: 'Auto-renewed', method: 'UPI' },
  { id: 't4', doctor: 'Dr. Rajesh Kumar', specialty: 'General Physician', type: 'Video Consultation', amount: 200, date: '15 May 2026', time: '10:00 AM', status: 'Completed', method: 'Wallet' },
  { id: 't5', doctor: 'Dr. Sneha Reddy', specialty: 'Pediatrics', type: 'In-Clinic Visit', amount: 600, date: '2 May 2026', time: '4:00 PM', status: 'Refunded', method: 'Card' },
];

const paymentMethods = [
  { id: 'pm1', type: 'UPI', label: 'meera@okicici', primary: true },
  { id: 'pm2', type: 'Card', label: '•••• •••• •••• 4523', primary: false },
  { id: 'pm3', type: 'Wallet', label: 'Sushruth Wallet — ₹1,240', primary: false },
];

const statusColors = {
  'Completed': { bg: tokens.successSoft, color: tokens.success },
  'Auto-renewed': { bg: tokens.primarySoft, color: tokens.primary },
  'Refunded': { bg: tokens.warningSoft, color: tokens.warning },
  'Pending': { bg: tokens.surfaceMuted, color: tokens.textTertiary },
};

export default function Payments() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const isPro = useStore((s) => s.isPro);

  const totalSpent = transactions.filter(t => t.status !== 'Refunded').reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageTransition>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, color: tokens.textPrimary, letterSpacing: '-0.02em' }}>
          Payments
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>
          Manage billing, transactions, and payment methods
        </Typography>
      </Box>

      {/* Summary — filled cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: tokens.primary, border: 'none' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AccountBalanceWalletOutlinedIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Wallet Balance</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '-0.02em' }}>₹1,240</Typography>
              <Button size="small" variant="outlined" startIcon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
                sx={{ mt: 1.5, color: '#fff', borderColor: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 700,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Add Money
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Card sx={{ bgcolor: tokens.successSoft, border: `1px solid ${tokens.success}22` }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: tokens.success }} />
                <Typography sx={{ fontSize: 13, color: tokens.success, fontWeight: 600 }}>Total Spent</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.success }}>₹{totalSpent.toLocaleString()}</Typography>
              <Typography sx={{ fontSize: 12, color: tokens.textTertiary, mt: 0.5 }}>Last 3 months</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Card sx={{ bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22` }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PaymentOutlinedIcon sx={{ fontSize: 18, color: tokens.primary }} />
                <Typography sx={{ fontSize: 13, color: tokens.primary, fontWeight: 600 }}>Subscription</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 28, color: tokens.primary }}>
                {isPro ? '₹299' : 'Free'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: tokens.textTertiary, mt: 0.5 }}>
                {isPro ? 'Renews 1 Jul 2026' : 'Upgrade for premium features'}
              </Typography>
              {!isPro && (
                <Button size="small" variant="contained" sx={{ mt: 1.5, fontSize: 12, fontWeight: 700 }} onClick={() => navigate('/upgrade')}>
                  Upgrade to Pro
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PillTabs */}
      <PillTabs tabs={['Transactions', 'Payment Methods', 'Invoices']} value={tab} onChange={setTab} />

      {/* Transactions */}
      {tab === 0 && (
        <SectionCard noPadding>
          {transactions.map((t, i) => {
            const sc = statusColors[t.status] || statusColors.Pending;
            return (
              <Box key={t.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, gap: 2,
                  '&:hover': { bgcolor: tokens.surfaceMuted }, transition: 'background-color 150ms ease' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: sc.bg, color: sc.color,
                      fontWeight: 700, fontSize: 14, borderRadius: 2 }}>
                      {t.doctor.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t.doctor}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{t.type} · {t.date}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label={t.status} size="small"
                      sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, height: 22, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.03em' }} />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 15, color: t.status === 'Refunded' ? tokens.textTertiary : tokens.textPrimary }}>
                        {t.status === 'Refunded' ? '-' : ''}₹{t.amount}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>{t.method}</Typography>
                    </Box>
                  </Box>
                </Box>
                {i < transactions.length - 1 && <Divider />}
              </Box>
            );
          })}
        </SectionCard>
      )}

      {/* Payment Methods */}
      {tab === 1 && (
        <Stack spacing={1.5}>
          {paymentMethods.map((pm) => (
            <Card key={pm.id} sx={{ bgcolor: pm.primary ? tokens.primarySoft : 'transparent',
              border: `1px solid ${pm.primary ? `${tokens.primary}22` : tokens.border}` }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: pm.primary ? '#fff' : tokens.surfaceMuted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pm.type === 'Card' ? <CreditCardOutlinedIcon sx={{ color: tokens.textSecondary }} /> :
                     pm.type === 'Wallet' ? <AccountBalanceWalletOutlinedIcon sx={{ color: tokens.textSecondary }} /> :
                     <Typography sx={{ fontSize: 18, fontWeight: 800, color: tokens.primary }}>₹</Typography>}
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{pm.type}</Typography>
                      {pm.primary && <Chip label="Primary" size="small"
                        sx={{ bgcolor: '#fff', color: tokens.primary, fontWeight: 700, height: 20, fontSize: 10 }} />}
                    </Box>
                    <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>{pm.label}</Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined" sx={{ fontSize: 12, fontWeight: 700 }}>
                  {pm.primary ? 'Manage' : 'Set Primary'}
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" startIcon={<AddRoundedIcon />} sx={{ py: 1.5, fontWeight: 700 }}>
            Add Payment Method
          </Button>
        </Stack>
      )}

      {/* Invoices */}
      {tab === 2 && (
        <Stack spacing={1.5}>
          {transactions.filter(t => t.status === 'Completed' || t.status === 'Auto-renewed').map((t) => {
            const sc = statusColors[t.status] || statusColors.Pending;
            return (
              <Card key={t.id}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: sc.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ReceiptLongOutlinedIcon sx={{ fontSize: 20, color: sc.color }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t.doctor}</Typography>
                      <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{t.date} · ₹{t.amount}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ border: `1px solid ${tokens.border}`, borderRadius: 2,
                      '&:hover': { bgcolor: tokens.surfaceMuted } }}>
                      <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Button size="small" variant="outlined" sx={{ fontSize: 12, fontWeight: 700 }}>View</Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </PageTransition>
  );
}

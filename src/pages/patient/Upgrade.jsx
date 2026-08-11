import { useState } from 'react';
import {
  Box, Typography, Grid, Button, Chip, Stack, Divider, Switch,
  Dialog, DialogContent, DialogTitle, IconButton, InputBase,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PageTransition from '../../components/PageTransition';
import { tokens } from '../../theme/theme';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    tagline: 'For personal health tracking',
    color: tokens.textSecondary,
    bg: tokens.surface,
    border: tokens.border,
    cta: 'Current Plan',
    features: [
      '3 consultations / month',
      '2 GB Health Vault storage',
      '5 AI assistant queries / day',
      'Basic appointment booking',
      'Medication reminders',
      null,
      null,
      null,
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 499,
    yearlyPrice: 399,
    tagline: 'For individuals & families',
    color: tokens.primary,
    bg: tokens.primarySoft,
    border: `${tokens.primary}40`,
    badge: 'Most Popular',
    cta: 'Upgrade to Pro',
    features: [
      'Unlimited consultations',
      '20 GB Health Vault storage',
      'Unlimited AI assistant',
      'Priority appointment booking',
      'Medication reminders + alerts',
      'Family accounts (up to 3)',
      'Video & in-clinic consultations',
      'Priority customer support',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    monthlyPrice: 999,
    yearlyPrice: 799,
    tagline: 'For comprehensive care',
    color: '#7C3AED',
    bg: '#F3F0FF',
    border: '#DDD6FE',
    cta: 'Get Ultimate',
    features: [
      'Everything in Pro',
      '100 GB Health Vault storage',
      'Unlimited AI assistant + priority',
      'Emergency care coordination',
      'Family accounts (up to 5)',
      'Dedicated health manager',
      'Annual health check packages',
      '24/7 doctor on call',
    ],
  },
];

const featureRows = [
  { label: 'Consultations / month', free: '3', pro: 'Unlimited', ult: 'Unlimited' },
  { label: 'Health Vault storage', free: '2 GB', pro: '20 GB', ult: '100 GB' },
  { label: 'AI health assistant', free: '5 queries/day', pro: 'Unlimited', ult: 'Priority unlimited' },
  { label: 'Family accounts', free: '—', pro: 'Up to 3', ult: 'Up to 5' },
  { label: 'Video consultations', free: true, pro: true, ult: true },
  { label: 'In-clinic bookings', free: true, pro: true, ult: true },
  { label: 'Priority booking', free: false, pro: true, ult: true },
  { label: 'Emergency care', free: false, pro: false, ult: true },
  { label: 'Dedicated health manager', free: false, pro: false, ult: true },
  { label: 'Customer support', free: 'Standard', pro: 'Priority', ult: '24/7 Dedicated' },
];

function FeatureCell({ val }) {
  if (val === true) return <CheckRoundedIcon sx={{ fontSize: 18, color: tokens.success }} />;
  if (val === false) return <CloseRoundedIcon sx={{ fontSize: 18, color: tokens.textTertiary, opacity: 0.4 }} />;
  return <Typography sx={{ fontSize: 13, color: tokens.textPrimary }}>{val}</Typography>;
}

function PaymentModal({ open, plan, yearly, onClose, onSuccess }) {
  const [step, setStep] = useState(0); // 0 = form, 1 = success
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  const handlePay = () => {
    setStep(1);
    setTimeout(() => { onSuccess(); onClose(); setStep(0); }, 2200);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
      <DialogTitle sx={{ p: 0 }}>
        {step === 0 && (
          <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Complete payment</Typography>
              <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
                Sushruth {plan.name} · ₹{price}/{yearly ? 'mo (billed yearly)' : 'month'}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: tokens.textTertiary }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {step === 0 ? (
          <Box sx={{ px: 3, pb: 3 }}>
            {/* Plan summary */}
            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: tokens.primarySoft, border: `1px solid ${tokens.primary}22`, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: tokens.primary }}>Sushruth {plan.name}</Typography>
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{yearly ? 'Annual billing' : 'Monthly billing'}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 22, color: tokens.primary }}>₹{price}<Typography component="span" sx={{ fontSize: 12, fontWeight: 600 }}>/mo</Typography></Typography>
            </Box>

            {/* Card form */}
            <Stack spacing={2}>
              {[
                { label: 'Cardholder name', key: 'name', placeholder: 'Meera Sharma' },
                { label: 'Card number', key: 'number', placeholder: '1234 5678 9012 3456' },
              ].map(({ label, key, placeholder }) => (
                <Box key={key}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 0.75 }}>{label}</Typography>
                  <Box sx={{ borderRadius: '10px', border: `1.5px solid ${tokens.border}`, px: 1.75, py: 1.25, '&:focus-within': { borderColor: tokens.primary } }}>
                    <InputBase fullWidth placeholder={placeholder} value={card[key]} onChange={(e) => setCard({ ...card, [key]: e.target.value })}
                      sx={{ fontSize: 14, fontFamily: '"Manrope",sans-serif' }} />
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[{ label: 'Expiry', key: 'expiry', placeholder: 'MM/YY' }, { label: 'CVV', key: 'cvv', placeholder: '•••' }].map(({ label, key, placeholder }) => (
                  <Box key={key} sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 0.75 }}>{label}</Typography>
                    <Box sx={{ borderRadius: '10px', border: `1.5px solid ${tokens.border}`, px: 1.75, py: 1.25, '&:focus-within': { borderColor: tokens.primary } }}>
                      <InputBase fullWidth placeholder={placeholder} value={card[key]} onChange={(e) => setCard({ ...card, [key]: e.target.value })}
                        sx={{ fontSize: 14, fontFamily: '"Manrope",sans-serif' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>

            <Button fullWidth variant="contained" onClick={handlePay}
              sx={{ mt: 3, py: 1.5, borderRadius: '12px', fontWeight: 700, fontSize: 15,
                background: `linear-gradient(135deg, ${tokens.primary}, #6366F1)`,
                boxShadow: `0 4px 16px ${tokens.primary}35`, '&:hover': { opacity: 0.93 } }}>
              Pay ₹{price} &rarr;
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
              <LockRoundedIcon sx={{ fontSize: 13, color: tokens.textTertiary }} />
              <Typography sx={{ fontSize: 11, color: tokens.textTertiary }}>256-bit SSL encrypted · Cancel anytime</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '20px', bgcolor: tokens.successSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
            }}>
              <CheckRoundedIcon sx={{ fontSize: 32, color: tokens.success }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 20, mb: 1 }}>Payment successful!</Typography>
            <Typography sx={{ fontSize: 14, color: tokens.textSecondary }}>Welcome to Sushruth {plan.name}. Your plan is now active.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Upgrade() {
  const navigate = useNavigate();
  const isPro = useStore((s) => s.isPro);
  const upgradeToPro = useStore((s) => s.upgradeToPro);
  const [yearly, setYearly] = useState(true);
  const [modalPlan, setModalPlan] = useState(null);

  const handleSelect = (plan) => {
    if (plan.id === 'free') return;
    setModalPlan(plan);
  };

  const handleSuccess = () => {
    upgradeToPro();
  };

  return (
    <PageTransition>
      {/* Back */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}
          sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: 13, textTransform: 'none', px: 1 }}>
          Back
        </Button>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
          label="Upgrade your health"
          sx={{ mb: 2, bgcolor: tokens.primarySoft, color: tokens.primary, fontWeight: 700, border: `1px solid ${tokens.primary}22` }}
        />
        <Typography sx={{ fontWeight: 900, fontSize: { xs: 28, md: 40 }, letterSpacing: '-0.03em', lineHeight: 1.15, mb: 1.5 }}>
          Choose your plan
        </Typography>
        <Typography sx={{ fontSize: 16, color: tokens.textSecondary, maxWidth: 480, mx: 'auto' }}>
          Unlimited consultations, AI health assistant, family care — everything you need for complete health management.
        </Typography>

        {/* Billing toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: yearly ? 500 : 700, color: yearly ? tokens.textSecondary : tokens.textPrimary }}>Monthly</Typography>
          <Switch checked={yearly} onChange={(e) => setYearly(e.target.checked)}
            sx={{ '& .MuiSwitch-thumb': { bgcolor: tokens.primary }, '& .MuiSwitch-track': { bgcolor: `${tokens.primary}55` } }} />
          <Typography sx={{ fontSize: 14, fontWeight: yearly ? 700 : 500, color: yearly ? tokens.textPrimary : tokens.textSecondary }}>Yearly</Typography>
          <Chip label="Save 20%" size="small"
            sx={{ bgcolor: tokens.successSoft, color: tokens.success, fontWeight: 700, fontSize: 11, border: `1px solid ${tokens.success}22` }} />
        </Box>
      </Box>

      {/* Plan Cards */}
      <Grid container spacing={2.5} sx={{ mb: 6, justifyContent: 'center' }}>
        {plans.map((plan) => {
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
          const isCurrentFree = plan.id === 'free' && !isPro;
          const isCurrentPro = plan.id === 'pro' && isPro;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: '20px',
                  border: `2px solid ${plan.id === 'pro' ? plan.color : plan.border}`,
                  bgcolor: plan.bg,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  '&:hover': plan.id !== 'free' ? {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 40px ${plan.color}20`,
                  } : {},
                }}
              >
                {plan.badge && (
                  <Chip label={plan.badge} size="small"
                    sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      bgcolor: plan.color, color: '#fff', fontWeight: 700, fontSize: 11, px: 1 }} />
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 20, color: plan.color, mb: 0.5 }}>{plan.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>{plan.tagline}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {price === 0 ? (
                    <Typography sx={{ fontWeight: 900, fontSize: 40, color: tokens.textPrimary, letterSpacing: '-0.03em', lineHeight: 1 }}>Free</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: 40, color: plan.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        ₹{price}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 0.75 }}>/month</Typography>
                    </Box>
                  )}
                  {yearly && price > 0 && (
                    <Typography sx={{ fontSize: 12, color: tokens.textTertiary, mt: 0.5 }}>
                      Billed ₹{price * 12}/year
                    </Typography>
                  )}
                </Box>

                <Stack spacing={1.25} sx={{ mb: 3, flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, opacity: f ? 1 : 0.3 }}>
                      <Box sx={{
                        width: 20, height: 20, borderRadius: '6px', flexShrink: 0,
                        bgcolor: f ? (plan.id === 'free' ? tokens.surfaceMuted : plan.color + '18') : tokens.surfaceMuted,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {f ? <CheckRoundedIcon sx={{ fontSize: 13, color: plan.id === 'free' ? tokens.textSecondary : plan.color }} />
                          : <CloseRoundedIcon sx={{ fontSize: 13, color: tokens.textTertiary }} />}
                      </Box>
                      <Typography sx={{ fontSize: 13.5, color: f ? tokens.textPrimary : tokens.textTertiary, fontWeight: f ? 500 : 400 }}>
                        {f || '—'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button fullWidth variant={plan.id === 'free' ? 'outlined' : 'contained'}
                  disabled={isCurrentFree || isCurrentPro}
                  onClick={() => handleSelect(plan)}
                  sx={{
                    py: 1.4, borderRadius: '12px', fontWeight: 700, fontSize: 14, textTransform: 'none',
                    ...(plan.id !== 'free' && {
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.id === 'pro' ? '#6366F1' : '#9333EA'})`,
                      boxShadow: `0 4px 14px ${plan.color}35`,
                      color: '#fff',
                      '&:hover': { opacity: 0.93, boxShadow: `0 6px 20px ${plan.color}45` },
                    }),
                    ...(plan.id === 'free' && {
                      borderColor: tokens.border, color: tokens.textSecondary,
                    }),
                  }}>
                  {isCurrentFree ? 'Current plan' : isCurrentPro && plan.id === 'pro' ? 'Active' : plan.cta}
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Feature comparison */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, textAlign: 'center', mb: 3, letterSpacing: '-0.02em' }}>
          Full feature comparison
        </Typography>
        <Box sx={{ borderRadius: '16px', border: `1px solid ${tokens.border}`, overflow: 'hidden', bgcolor: tokens.surface }}>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', bgcolor: tokens.surfaceMuted, px: 3, py: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</Typography>
            {['Free', 'Pro', 'Ultimate'].map((n) => (
              <Typography key={n} sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, textAlign: 'center' }}>{n}</Typography>
            ))}
          </Box>
          {featureRows.map((row, i) => (
            <Box key={row.label}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', px: 3, py: 1.75, alignItems: 'center',
                '&:hover': { bgcolor: tokens.surfaceMuted }, transition: 'background 150ms' }}>
                <Typography sx={{ fontSize: 14, color: tokens.textPrimary }}>{row.label}</Typography>
                {[row.free, row.pro, row.ult].map((val, j) => (
                  <Box key={j} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FeatureCell val={val} />
                  </Box>
                ))}
              </Box>
              {i < featureRows.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Trust section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mb: 4 }}>
        {[
          { icon: LockRoundedIcon, label: '256-bit SSL encryption' },
          { icon: ShieldRoundedIcon, label: 'HIPAA compliant' },
          { icon: BoltRoundedIcon, label: 'Cancel anytime' },
          { icon: GroupRoundedIcon, label: '2,40,000+ active users' },
        ].map(({ icon: Icon, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon sx={{ fontSize: 18, color: tokens.textTertiary }} />
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 600 }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Payment modal */}
      {modalPlan && (
        <PaymentModal
          open={Boolean(modalPlan)}
          plan={modalPlan}
          yearly={yearly}
          onClose={() => setModalPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </PageTransition>
  );
}

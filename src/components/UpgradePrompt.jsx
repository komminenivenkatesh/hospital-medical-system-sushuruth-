import { Box, Card, CardContent, Typography, Button, Chip, Link } from '@mui/material';
import useStore from '../store/useStore';

// Reusable Pro upgrade card (centered locked state).
export default function UpgradePrompt({
  icon: Icon, title, description, ctaLabel = 'Upgrade to Pro — ₹299/month', proLabel = 'Pro Feature',
}) {
  const upgradeToPro = useStore((s) => s.upgradeToPro);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ width: 400, maxWidth: '100%' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {Icon && <Icon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>{description}</Typography>
          <Chip label={proLabel} color="warning"
            sx={{ bgcolor: '#FFFBEB', color: '#B45309', fontWeight: 700, mb: 2.5 }} />
          <Button fullWidth variant="contained" size="large" onClick={upgradeToPro} sx={{ py: 1.25, mb: 1.5 }}>
            {ctaLabel}
          </Button>
          <Link component="button" underline="hover" sx={{ fontSize: 13, color: 'primary.main', fontWeight: 600 }}>
            See what's included
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}

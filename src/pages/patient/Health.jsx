import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, IconButton, Table, TableHead,
  TableRow, TableCell, TableBody, Button, LinearProgress, Stack, Grid, Collapse,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BrainIcon from '@mui/icons-material/PsychologyOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import PageTransition, { SectionReveal } from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import { PillTabs } from '../../components/SectionCard';
import { prescriptions, records, mriReports } from '../../data/prescriptions';
import { tokens } from '../../theme/theme';

const statCards = [
  { label: 'Total Records', value: records.length + mriReports.length + prescriptions.length, icon: FolderOpenOutlinedIcon, bg: tokens.primarySoft, color: tokens.primary, border: tokens.primary },
  { label: 'Prescriptions', value: prescriptions.length, icon: MedicalServicesOutlinedIcon, bg: tokens.successSoft, color: tokens.success, border: tokens.success },
  { label: 'MRI Reports', value: mriReports.length, icon: BrainIcon, bg: '#FEF6E7', color: '#B45309', border: '#B45309' },
  { label: 'Lab Reports', value: records.length, icon: ScienceRoundedIcon, bg: '#F3F0FF', color: '#7C3AED', border: '#7C3AED' },
];

const statusColor = { Normal: tokens.success, Borderline: '#F59E0B', Abnormal: '#EF4444' };
const statusIcon = { Normal: CheckCircleRoundedIcon, Borderline: WarningAmberRoundedIcon, Abnormal: WarningAmberRoundedIcon };
const riskColors = { success: { bg: tokens.successSoft, color: tokens.success, label: 'Normal' }, warning: { bg: '#FEF6E7', color: '#B45309', label: 'Review Needed' } };

export default function Health() {
  const [tab, setTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <PageTransition>
      <PageHeader
        title="Health Vault"
        subtitle="Your secure medical records, prescriptions, and lab reports, stored securely."
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Health Records' }]}
        right={
          <Button variant="contained" startIcon={<CloudUploadOutlinedIcon />}
            sx={{ px: 3, fontWeight: 700, borderRadius: 100, display: { xs: 'none', sm: 'flex' } }}>
            Upload
          </Button>
        }
      />

      <SectionReveal>


      {/* Stat cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {statCards.map(({ label, value, icon: Icon, bg, color, border }) => (
          <Grid key={label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ bgcolor: bg, border: `1px solid ${border}22` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 26, color, lineHeight: 1.1 }}>{value}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </SectionReveal>

      {/* Tabs */}
      <PillTabs tabs={['Prescriptions', 'Lab Reports', 'MRI Reports']} value={tab} onChange={setTab} />

      {/* Prescriptions Tab */}
      {tab === 0 && (
        <Stack spacing={2}>
          {prescriptions.map((p) => {
            const isActive = p.status === 'Active';
            return (
              <Card key={p.id} sx={{ overflow: 'hidden', transition: 'all 0.2s',
                '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ height: 4, bgcolor: isActive ? tokens.primary : tokens.success }} />

                  <Box sx={{ p: { xs: 2, md: 3 }, cursor: 'pointer' }}
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar src={p.photo} sx={{ width: 56, height: 56, border: `2px solid ${tokens.border}` }}>
                            {p.initials}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: 17 }}>{p.doctorName}</Typography>
                              <Chip label={p.status} size="small"
                                sx={{ bgcolor: isActive ? tokens.primarySoft : tokens.successSoft,
                                  color: isActive ? tokens.primary : tokens.success,
                                  fontWeight: 700, fontSize: 10, height: 20, textTransform: 'uppercase', letterSpacing: '0.03em' }} />
                            </Box>
                            <Typography sx={{ fontSize: 14, color: tokens.textSecondary, fontWeight: 500, mb: 0.5 }}>
                              {p.specialty} · {p.hospital}
                            </Typography>
                            <Chip label={p.diagnosis} size="small"
                              sx={{ height: 24, fontSize: 12, fontWeight: 600, bgcolor: tokens.surfaceMuted, color: tokens.textPrimary }} />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3.5 }}>
                        <Stack spacing={0.75}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Prescribed: {p.date}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventRepeatRoundedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Follow-up: {p.followUp}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.primary }}>
                            {p.medications.length} medications
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, md: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                          <IconButton size="small" sx={{ bgcolor: tokens.surfaceMuted }}>
                            {expandedId === p.id ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Collapse in={expandedId === p.id}>
                    <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
                      {/* Doctor notes */}
                      {p.notes && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5, p: 2, bgcolor: tokens.surfaceMuted, borderRadius: 2 }}>
                          <NoteAltOutlinedIcon sx={{ fontSize: 16, color: tokens.textTertiary, mt: 0.25 }} />
                          <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 0.25 }}>Doctor's Notes</Typography>
                            <Typography sx={{ fontSize: 13, color: tokens.textPrimary }}>{p.notes}</Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Medications table */}
                      <Box sx={{ bgcolor: '#fff', borderRadius: 2.5, overflow: 'hidden', border: `1px solid ${tokens.border}` }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: tokens.surfaceMuted }}>
                              <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 12 }}>Medication</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 12 }}>Type</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 12 }}>Dosage</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 12 }}>Frequency</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: tokens.textSecondary, fontSize: 12 }}>Duration</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {p.medications.map((m) => (
                              <TableRow key={m.name} sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{m.name}</TableCell>
                                <TableCell>
                                  <Chip label={m.type} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: tokens.primarySoft, color: tokens.primary }} />
                                </TableCell>
                                <TableCell sx={{ fontSize: 13, color: tokens.textSecondary }}>{m.dosage}</TableCell>
                                <TableCell sx={{ fontSize: 13, color: tokens.textSecondary }}>{m.frequency}</TableCell>
                                <TableCell sx={{ fontSize: 13, color: tokens.textSecondary }}>{m.duration}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5 }}>
                        <Button size="small" variant="contained" startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                          sx={{ fontWeight: 700, px: 3 }}>Download PDF</Button>
                        <Button size="small" variant="outlined" startIcon={<ShareRoundedIcon sx={{ fontSize: 16 }} />}
                          sx={{ fontWeight: 700, px: 3 }}>Share</Button>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Lab Reports Tab */}
      {tab === 1 && (
        <Stack spacing={2}>
          {records.map((r) => {
            const StatusIcon = statusIcon[r.status] || CheckCircleRoundedIcon;
            const sColor = statusColor[r.status] || tokens.success;
            return (
              <Card key={r.id} sx={{ overflow: 'hidden', transition: 'all 0.2s',
                '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ height: 4, bgcolor: sColor }} />
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: tokens.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {r.type === 'Radiology' ? <MonitorHeartRoundedIcon sx={{ color: tokens.primary, fontSize: 24 }} /> :
                              r.type === 'Diagnostic' ? <MonitorHeartRoundedIcon sx={{ color: tokens.primary, fontSize: 24 }} /> :
                              <ScienceRoundedIcon sx={{ color: tokens.primary, fontSize: 24 }} />}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.25 }}>{r.title}</Typography>
                            <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>
                              {r.type} · {r.size}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3.5 }}>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{r.date}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>
                            {r.doctor} · {r.hospital}
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
                          <Chip icon={<StatusIcon sx={{ fontSize: 14 }} />} label={r.status} size="small"
                            sx={{ bgcolor: `${sColor}18`, color: sColor, fontWeight: 700, fontSize: 12,
                              '& .MuiChip-icon': { color: sColor } }} />
                          <Button variant="outlined" size="small" startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                            sx={{ fontWeight: 700, borderRadius: 2 }}>
                            View
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* MRI Reports Tab */}
      {tab === 2 && (
        <Stack spacing={2}>
          {mriReports.map((m) => {
            const rc = riskColors[m.risk] || riskColors.success;
            return (
              <Card key={m.id} sx={{ overflow: 'hidden', transition: 'all 0.2s',
                '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ height: 4, bgcolor: rc.color }} />
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ width: 56, height: 56, borderRadius: 2.5, bgcolor: tokens.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <BrainIcon sx={{ color: tokens.primary, fontSize: 28 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.25 }}>{m.title}</Typography>
                            <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mb: 0.5 }}>
                              {m.scanType} · {m.slices} slices · {m.size}
                            </Typography>
                            <Chip label={rc.label} size="small"
                              sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 700, fontSize: 11, height: 22 }} />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3.5 }}>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{m.date}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnOutlinedIcon sx={{ fontSize: 14, color: tokens.textTertiary }} />
                            <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>{m.hospital}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>
                            Reviewed by {m.doctor}
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3.5 }}>
                        <Stack spacing={1} sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Typography sx={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 500, textAlign: { md: 'right' } }}>
                            {m.summary}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" size="small" startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                              sx={{ fontWeight: 700, borderRadius: 2 }}>
                              Download
                            </Button>
                            <Button variant="outlined" size="small"
                              sx={{ fontWeight: 700, borderRadius: 2 }}>
                              View
                            </Button>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Storage bar */}
      <Card sx={{ mt: 4, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: tokens.textPrimary }}>Storage Used</Typography>
              <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Medical records and scans</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: tokens.primary }}>3.2 GB</Typography>
              <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>of 5.0 GB</Typography>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={64} sx={{ height: 10, borderRadius: 5, bgcolor: tokens.surfaceMuted,
            '& .MuiLinearProgress-bar': { borderRadius: 5, background: `linear-gradient(90deg, ${tokens.primary}, #60A5FA)` } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.primary }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>MRI Scans (2.1 GB)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.success }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Reports (0.8 GB)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Documents (0.3 GB)</Typography>
              </Box>
            </Box>
            <Button size="small" variant="text" sx={{ fontSize: 12, fontWeight: 700 }}>Upgrade Storage</Button>
          </Box>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

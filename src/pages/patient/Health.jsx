import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, IconButton, Table, TableHead,
  TableRow, TableCell, TableBody, Button, LinearProgress, Stack, Grid, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  Snackbar, Alert, CircularProgress,
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import PageTransition, { SectionReveal } from '../../components/PageTransition';
import PageHeader from '../../components/PageHeader';
import { PillTabs } from '../../components/SectionCard';
import { prescriptions as initialPrescriptions, records as initialRecords, mriReports } from '../../data/prescriptions';
import { tokens } from '../../theme/theme';
import { healthAPI } from '../../services/api';

const statusColor = { Normal: tokens.success, Borderline: '#F59E0B', Abnormal: '#EF4444' };
const statusIcon = { Normal: CheckCircleRoundedIcon, Borderline: WarningAmberRoundedIcon, Abnormal: WarningAmberRoundedIcon };
const riskColors = { success: { bg: tokens.successSoft, color: tokens.success, label: 'Normal' }, warning: { bg: '#FEF6E7', color: '#B45309', label: 'Review Needed' } };

export default function Health() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [prescriptionsList, setPrescriptionsList] = useState(initialPrescriptions);
  const [labRecordsList, setLabRecordsList] = useState(initialRecords);

  // Dialog & Action States
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    testName: '',
    category: 'Hematology',
    labName: 'Sushruth Diagnostics',
    resultStatus: 'Normal',
    notes: '',
  });

  const [previewReport, setPreviewReport] = useState(null);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    healthAPI.getPrescriptions()
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((p) => ({
            id: p._id,
            diagnosis: p.diagnosis,
            doctorName: p.doctor?.user?.name || 'Dr. Arvind Rao',
            doctorSpecialty: p.doctor?.specialty || 'Neurology',
            hospital: p.doctor?.hospital || 'Apollo Hospital',
            doctorPhoto: p.doctor?.user?.avatar || '',
            date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            status: 'Active',
            notes: p.notes || p.advice || '',
            medications: (p.medicines || []).map((m) => ({
              name: m.name,
              dosage: m.dosage,
              frequency: m.frequency,
              duration: m.duration,
              type: m.type || 'Tablet',
            })),
          }));
          setPrescriptionsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch prescriptions, using defaults:', err.message));

    healthAPI.getLabReports()
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((r) => ({
            id: r._id,
            title: r.testName,
            date: r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            type: r.category || 'Lab Report',
            doctor: r.doctor?.user?.name || 'Diagnostic Center',
            hospital: r.labName || 'Sushruth Diagnostics & Imaging Labs',
            status: r.resultStatus || 'Normal',
            size: '1.2 MB',
            notes: r.notes || '',
            parameters: r.parameters || [],
          }));
          setLabRecordsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch lab reports, using defaults:', err.message));
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.testName.trim()) return;
    setUploading(true);
    try {
      const { data } = await healthAPI.createLabReport(uploadForm);
      const newRec = {
        id: data._id,
        title: data.testName,
        date: 'Today',
        type: data.category,
        doctor: 'Self Uploaded',
        hospital: data.labName,
        status: data.resultStatus,
        size: '0.8 MB',
        notes: data.notes,
      };
      setLabRecordsList((prev) => [newRec, ...prev]);
      setUploadOpen(false);
      setSnackbar('Medical record uploaded and encrypted into your vault!');
      setUploadForm({
        testName: '',
        category: 'Hematology',
        labName: 'Sushruth Diagnostics',
        resultStatus: 'Normal',
        notes: '',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setSnackbar('Failed to upload record. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadPrescription = (p) => {
    const printContent = `
Sushruth Healthcare - Electronic Prescription
-------------------------------------------------
Prescription ID: ${p.id}
Doctor: ${p.doctorName} (${p.doctorSpecialty})
Facility: ${p.hospital}
Date: ${p.date}
Diagnosis: ${p.diagnosis}

Medications:
${(p.medications || []).map((m) => `- ${m.name} (${m.dosage}) | ${m.frequency} for ${m.duration}`).join('\n')}

Clinical Advice / Notes:
${p.notes || 'Take medications as prescribed.'}
-------------------------------------------------
NABH & HIPAA Compliant Healthcare Document
    `;
    const blob = new Blob([printContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription-${p.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar('Prescription downloaded successfully!');
  };

  const handleSharePrescription = (p) => {
    const text = `Prescription from ${p.doctorName} for ${p.diagnosis}. View securely at Sushruth Healthcare Vault.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setSnackbar('Prescription summary link copied to clipboard!');
    }
  };

  const statCards = [
    { label: 'Total Records', value: labRecordsList.length + mriReports.length + prescriptionsList.length, icon: FolderOpenOutlinedIcon, bg: tokens.primarySoft, color: tokens.primary, border: tokens.primary },
    { label: 'Prescriptions', value: prescriptionsList.length, icon: MedicalServicesOutlinedIcon, bg: tokens.successSoft, color: tokens.success, border: tokens.success },
    { label: 'MRI Reports', value: mriReports.length, icon: BrainIcon, bg: '#FEF6E7', color: '#B45309', border: '#B45309' },
    { label: 'Lab Reports', value: labRecordsList.length, icon: ScienceRoundedIcon, bg: '#F3F0FF', color: '#7C3AED', border: '#7C3AED' },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Health Vault"
        subtitle="Your secure medical records, prescriptions, and lab reports, stored securely."
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Health Records' }]}
        right={
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => setUploadOpen(true)}
            sx={{ px: { xs: 2, sm: 3 }, fontWeight: 700, borderRadius: 100, width: { xs: '100%', sm: 'auto' } }}
          >
            Upload Report
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
                    <Typography sx={{ fontWeight: 800, fontSize: 22, color, lineHeight: 1.1 }}>{value}</Typography>
                    <Typography sx={{ fontSize: 12, color: tokens.textSecondary, fontWeight: 600 }}>{label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SectionReveal>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <PillTabs
          tabs={['Active Prescriptions', 'Lab & Blood Tests', 'MRI & Scans']}
          value={tab}
          onChange={setTab}
        />
      </Box>

      {/* Prescriptions Tab */}
      {tab === 0 && (
        <Stack spacing={2}>
          {prescriptionsList.map((p) => {
            const isExp = expandedId === p.id;
            return (
              <Card key={p.id} sx={{ overflow: 'hidden', transition: 'all 0.2s',
                '&:hover': { borderColor: tokens.primary, boxShadow: tokens.cardShadowHover } }}>
                <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={p.doctorPhoto} sx={{ width: 48, height: 48, bgcolor: tokens.primary, color: '#fff', fontWeight: 700 }}>
                        {p.doctorName.split(' ').slice(1).map((w) => w[0]).join('')}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{p.diagnosis}</Typography>
                          <Chip label={p.status} size="small"
                            sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: tokens.successSoft, color: tokens.success }} />
                        </Box>
                        <Typography sx={{ fontSize: 13, color: tokens.textSecondary, mt: 0.25 }}>
                          {p.doctorName} · {p.doctorSpecialty} · {p.hospital}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography sx={{ fontSize: 12, color: tokens.textTertiary }}>Prescribed on</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{p.date}</Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setExpandedId(isExp ? null : p.id)}
                        sx={{ bgcolor: tokens.surfaceMuted }}>
                        {isExp ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expanded detail */}
                  <Collapse in={isExp}>
                    <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${tokens.border}` }}>
                      {p.notes && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, p: 1.5, bgcolor: tokens.surfaceMuted, borderRadius: 2 }}>
                          <NoteAltOutlinedIcon sx={{ fontSize: 18, color: tokens.primary }} />
                          <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>{p.notes}</Typography>
                        </Box>
                      )}

                      <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>
                        Prescribed Medications ({p.medications?.length || 0})
                      </Typography>

                      <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                        <Table size="small" sx={{ minWidth: 500 }}>
                          <TableHead>
                            <TableRow sx={{ bgcolor: tokens.surfaceMuted }}>
                              <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Medicine</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Form</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Dosage</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Frequency</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Duration</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(p.medications || []).map((m, i) => (
                              <TableRow key={i}>
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
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleDownloadPrescription(p)}
                          sx={{ fontWeight: 700, px: 3, borderRadius: '100px' }}
                        >
                          Download PDF
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ShareRoundedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleSharePrescription(p)}
                          sx={{ fontWeight: 700, px: 3, borderRadius: '100px' }}
                        >
                          Share
                        </Button>
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
          {labRecordsList.map((r) => {
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
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />}
                            onClick={() => setPreviewReport(r)}
                            sx={{ fontWeight: 700, borderRadius: '100px' }}
                          >
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
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DownloadRoundedIcon sx={{ fontSize: 14 }} />}
                              onClick={() => {
                                setSnackbar(`Downloading ${m.title} DICOM scan package...`);
                              }}
                              sx={{ fontWeight: 700, borderRadius: '100px' }}
                            >
                              Download
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate('/mri-lab')}
                              sx={{ fontWeight: 700, borderRadius: '100px' }}
                            >
                              Open in Lab
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

      {/* Storage usage bar */}
      <Card sx={{ mt: 3, bgcolor: tokens.surfaceMuted, border: 'none' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Vault Storage Used</Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textSecondary }}>2.3 GB of 10 GB (23%)</Typography>
          </Box>
          <LinearProgress variant="determinate" value={23}
            sx={{ height: 6, borderRadius: 3, bgcolor: `${tokens.primary}22`,
              '& .MuiLinearProgress-bar': { bgcolor: tokens.primary, borderRadius: 3 } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.primary }} />
                <Typography sx={{ fontSize: 12, color: tokens.textSecondary }}>Scans (1.2 GB)</Typography>
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
            <Button
              size="small"
              variant="text"
              onClick={() => navigate('/upgrade')}
              sx={{ fontSize: 12, fontWeight: 700 }}
            >
              Upgrade Storage
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Upload Medical Record</DialogTitle>
        <Box component="form" onSubmit={handleUploadSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Test / Document Name"
              required
              fullWidth
              value={uploadForm.testName}
              onChange={(e) => setUploadForm({ ...uploadForm, testName: e.target.value })}
              placeholder="e.g. Complete Blood Count (CBC) or Lipid Profile"
            />
            <TextField
              label="Category"
              select
              fullWidth
              value={uploadForm.category}
              onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
            >
              <MenuItem value="Hematology">Hematology</MenuItem>
              <MenuItem value="Biochemistry">Biochemistry</MenuItem>
              <MenuItem value="Endocrinology">Endocrinology</MenuItem>
              <MenuItem value="Radiology">Radiology</MenuItem>
              <MenuItem value="General Lab">General Lab</MenuItem>
            </TextField>
            <TextField
              label="Diagnostic Center / Hospital"
              fullWidth
              value={uploadForm.labName}
              onChange={(e) => setUploadForm({ ...uploadForm, labName: e.target.value })}
            />
            <TextField
              label="Result Status"
              select
              fullWidth
              value={uploadForm.resultStatus}
              onChange={(e) => setUploadForm({ ...uploadForm, resultStatus: e.target.value })}
            >
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="Borderline">Borderline / Review Needed</MenuItem>
              <MenuItem value="Abnormal">Abnormal / Flagged</MenuItem>
            </TextField>
            <TextField
              label="Clinical Notes / Findings"
              multiline
              rows={3}
              fullWidth
              value={uploadForm.notes}
              onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
              placeholder="Enter key observations or doctor comments..."
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={uploading}
              sx={{ borderRadius: '100px', px: 3 }}
            >
              {uploading ? 'Encrypting & Uploading...' : 'Upload & Save to Vault'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* View Report Preview Dialog */}
      <Dialog
        open={!!previewReport}
        onClose={() => setPreviewReport(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {previewReport?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: tokens.textSecondary, fontSize: 13 }}>Category:</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{previewReport?.type}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: tokens.textSecondary, fontSize: 13 }}>Date Recorded:</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{previewReport?.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: tokens.textSecondary, fontSize: 13 }}>Diagnostic Facility:</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{previewReport?.hospital}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: tokens.textSecondary, fontSize: 13 }}>Status:</Typography>
              <Chip
                label={previewReport?.status}
                size="small"
                sx={{
                  bgcolor: previewReport?.status === 'Normal' ? tokens.successSoft : '#FEF6E7',
                  color: previewReport?.status === 'Normal' ? tokens.success : '#B45309',
                  fontWeight: 700,
                }}
              />
            </Box>
            {previewReport?.notes && (
              <Box sx={{ p: 2, bgcolor: tokens.surfaceMuted, borderRadius: '12px' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textSecondary, mb: 0.5 }}>
                  Clinical Notes:
                </Typography>
                <Typography sx={{ fontSize: 13 }}>{previewReport.notes}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setPreviewReport(null)} sx={{ borderRadius: '100px' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewReport(null);
              setSnackbar('Report details exported to download folder.');
            }}
            sx={{ borderRadius: '100px' }}
          >
            Export Record
          </Button>
        </DialogActions>
      </Dialog>

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

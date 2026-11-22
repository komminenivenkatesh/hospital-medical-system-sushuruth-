import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, Grid, Avatar, CircularProgress, Chip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import { scenes, doctorPhotos } from '../../data/assets';
import { articleAPI } from '../../services/api';

const defaultArticleContent = {
  title: 'Unlock Your Brain’s Full Potential with Better Sleep',
  date: 'October 24, 2026',
  author: {
    name: 'Dr. Arvind Rao',
    role: 'Lead Neurologist · Fortis Hospital',
    avatar: doctorPhotos.arvind,
  },
  paragraph1: 'Quality sleep is the fundamental foundation of neurological resilience. During deep NREM and REM stages, the brain activates the glymphatic system—clearing out toxic metabolic waste products including beta-amyloid proteins that accumulate throughout waking hours.\n\nWhile the main intent of sleep is restorative, neural synchronization during slow-wave oscillations cements synaptic memory consolidation, transforming transient daily impressions into durable long-term cognitive knowledge.',
  pullQuote: 'Deep sleep is not downtime; it is your brain’s active restoration window.',
  paragraph2: 'Optimizing sleep starts with consistent light exposure: natural sunlight within 30 minutes of waking suppresses melatonin and resets your master circadian clock in the suprachiasmatic nucleus. In the evening, dimming artificial blue light signals natural melatonin secretion.\n\nClinically, patients suffering from chronic migraine and tension headaches often experience a 40% reduction in headache frequency simply by stabilizing their sleep schedule to within a 30-minute window every day.',
  relatedArticles: [
    { title: 'New Migraine Treatments', img: scenes.lab, category: 'NEUROLOGY' },
    { title: 'Diets That Will Satisfy Your Brain', img: scenes.wellness, category: 'NUTRITION' },
    { title: 'The Science of Meditation', img: scenes.article2, category: 'PSYCHOLOGY' },
  ],
};

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(defaultArticleContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== '1') {
      setLoading(true);
      articleAPI.getById(id)
        .then(({ data }) => {
          if (data?.article) {
            const a = data.article;
            setContent({
              title: a.title,
              date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
              author: {
                name: a.author?.name || 'Dr. Medical Specialist',
                role: a.author?.role || 'Sushruth Medical Editorial',
                avatar: a.author?.avatar || doctorPhotos.arvind,
              },
              paragraph1: a.paragraph1 || a.desc || defaultArticleContent.paragraph1,
              pullQuote: a.pullQuote || 'Mindful living and clinical precision for lifelong neurological health.',
              paragraph2: a.paragraph2 || defaultArticleContent.paragraph2,
              img: a.img || scenes.lab,
              relatedArticles: (data.related || []).map((r) => ({
                id: r._id,
                title: r.title,
                img: r.img || scenes.wellness,
                category: r.category?.toUpperCase() || 'HEALTH',
              })),
            });
          }
        })
        .catch((err) => console.warn('Could not load article from API:', err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <PageTransition>
      <Box sx={{ mx: { xs: -2, md: -4 }, mt: { xs: -2, md: -4 } }}>
        {/* Top Back Button */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/articles')}
            sx={{ fontWeight: 700, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 100, '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            Articles
          </Button>
        </Box>

        {/* HERO SECTION */}
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 260, sm: 350, md: 520 }, bgcolor: '#1E293B' }}>
          <SmartImage src={content.img || scenes.lab} alt="hero" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          {/* Blue/Purple accent block overlapping */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -20, md: -30 },
              left: 0,
              width: { xs: '85%', sm: '70%', md: '35%' },
              height: { xs: 60, md: 100 },
              bgcolor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2.5, md: 4 },
              boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: { xs: 11, md: 13 }, letterSpacing: 2, fontWeight: 800 }}>
              SUSHRUTH CLINICAL RESEARCH
            </Typography>
          </Box>
        </Box>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 6, md: 10 }, pb: 8 }}>
          {loading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 3, md: 6 }}>
              {/* Content Column first on mobile */}
              <Grid size={{ xs: 12, md: 9 }} sx={{ order: { xs: 1, md: 2 } }}>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 24, sm: 32, md: 40 }, lineHeight: 1.2, color: '#111827', mb: 2 }}>
                  {content.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#9CA3AF', mb: 4, fontWeight: 600 }}>
                  Published on {content.date} · Peer Reviewed
                </Typography>

                {/* Paragraph with Drop Cap */}
                <Box sx={{ position: 'relative', mb: 4 }}>
                  <Typography component="span" sx={{ float: 'left', fontSize: { xs: 54, md: 72 }, lineHeight: 0.8, fontWeight: 900, color: '#2563EB', mr: 2, mt: 1 }}>
                    {content.paragraph1.charAt(0) || 'Q'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 15, md: 16 }, lineHeight: 1.85, color: '#374151' }}>
                    {content.paragraph1.slice(1)}
                  </Typography>
                </Box>
              </Grid>

              {/* Sidebar (Author) */}
              <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 1 } }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  gap: { xs: 2, md: 0 },
                  p: { xs: 2, md: 0 },
                  bgcolor: { xs: '#F9FAFB', md: 'transparent' },
                  borderRadius: 3,
                  position: { xs: 'static', md: 'sticky' },
                  top: 100,
                }}>
                  <Avatar src={content.author.avatar} sx={{ width: { xs: 52, md: 80 }, height: { xs: 52, md: 80 }, mb: { xs: 0, md: 2 }, borderRadius: 3, bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: 24 }}>
                    {content.author.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.5, mb: 0.5 }}>
                      {content.author.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.5, maxWidth: 180 }}>
                      {content.author.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* MIDDLE IMAGE & PULL QUOTE */}
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 1100, mx: 'auto', mb: 10, px: { xs: 2, md: 4 } }}>
          <Box sx={{ width: '100%', height: { xs: 260, md: 440 }, borderRadius: 4, overflow: 'hidden' }}>
            <SmartImage src={scenes.wellness} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              bottom: { md: -30 },
              right: { md: 40 },
              width: { xs: '100%', md: '55%' },
              bgcolor: '#0F172A',
              color: '#fff',
              borderRadius: 3,
              p: { xs: 3, md: 5 },
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              borderLeft: '4px solid #2563EB',
            }}
          >
            <Typography sx={{ fontSize: { xs: 18, md: 24 }, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
              “{content.pullQuote}”
            </Typography>
          </Box>
        </Box>

        {/* SECOND PARAGRAPH */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, mb: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 3 }} />
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography sx={{ fontSize: 16, lineHeight: 1.85, color: '#374151', mb: 6 }}>
                {content.paragraph2}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* SHARE BAR */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, mb: 10 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 3 }} />
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Box sx={{ bgcolor: '#2563EB', color: '#fff', px: 3, py: 0.75, fontWeight: 700, fontSize: 12, mr: 3, borderRadius: 1 }}>
                  SHARE ARTICLE
                </Box>
                <Box sx={{ display: 'flex', gap: 2.5, color: '#64748B' }}>
                  <FacebookIcon sx={{ cursor: 'pointer', '&:hover': { color: '#2563EB' } }} />
                  <TwitterIcon sx={{ cursor: 'pointer', '&:hover': { color: '#0284C7' } }} />
                  <LinkedInIcon sx={{ cursor: 'pointer', '&:hover': { color: '#0369A1' } }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* RELATED ARTICLES */}
        <Box sx={{ bgcolor: '#F8FAFC', py: 8, px: { xs: 2, md: 6 }, borderTop: '1px solid #E2E8F0' }}>
          <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 22, mb: 4, color: '#0F172A' }}>
              Related Medical Publications
            </Typography>
            <Grid container spacing={3}>
              {(content.relatedArticles || []).map((rel, idx) => (
                <Grid size={{ xs: 12, md: 4 }} key={rel.id || idx}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 200ms ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' },
                    }}
                    onClick={() => rel.id && navigate(`/article/${rel.id}`)}
                  >
                    <Box sx={{ height: 180, width: '100%' }}>
                      <SmartImage src={rel.img || scenes.wellness} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ p: 2.5 }}>
                      <Chip label={rel.category} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: 10, mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>
                        {rel.title}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
}

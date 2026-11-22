import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, Divider, Stack, Chip, Button, CircularProgress } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import { scenes } from '../../data/assets';
import { tokens } from '../../theme/theme';
import { articleAPI } from '../../services/api';

const defaultHeroArticle = {
  img: scenes.article2,
  title: "Unlock Your Brain's Full Potential with Better Sleep",
  desc: "A deep dive into how circadian rhythms and deep sleep phases directly impact your cognitive performance, memory retention, and overall mental health. Discover actionable tips to optimize your nighttime routine.",
  tag: 'Wellness',
  date: 'Today',
};

const defaultArticles = [
  { tag: 'Neurology', date: 'October 10, 2024', title: 'Discover the Hidden Gems: New Migraine Treatments', desc: 'Embark on a journey beyond the standard treatments. Our handpicked latest therapies promise unique experiences and better symptom management.', subTags: ['Health', 'Research'] },
  { tag: 'Nutrition', date: 'October 05, 2024', title: 'Epicurean Adventures: Diets That Will Satisfy Your Brain', desc: 'Indulge your senses in a culinary exploration like never before. Our brain-boosting foods promise not just delectable dishes but better cognitive health.', subTags: ['Diet', 'Food'] },
  { tag: 'Wellness', date: 'November 23, 2024', title: 'Thrill-Seeker\'s Guide: Adrenaline and Mental Health', desc: 'Calling all adrenaline junkies! Brace yourself for heart-pounding adventures and see how they affect your brain chemistry.', subTags: ['Adventure', 'Nature'] },
  { tag: 'Psychiatry', date: 'September 13, 2024', title: 'Island Hopping: Unwind Your Mind on Pristine Beaches', desc: 'Escape to sun-kissed shores and turquoise waters. Unwind on pristine beaches and explore how nature reduces anxiety.', subTags: ['Ocean', 'Beach'] },
  { tag: 'Lifestyle', date: 'August 12, 2024', title: 'Artistic Wanderlust: Cultural Tours for Cognitive Longevity', desc: 'Embark on a cultural odyssey that celebrates the world\'s artistic tapestry. Dive deep into how art improves neuroplasticity.', subTags: ['Culture', 'Art'] },
  { tag: 'Fitness', date: 'July 05, 2024', title: 'Nature\'s Symphony: Eco-Friendly Workouts for the Brain', desc: 'Join us on a journey where sustainability meets fitness. Explore breathtaking natural trails while improving your memory.', subTags: ['Eco-Travel', 'Nature'] },
  { tag: 'Psychology', date: 'June 20, 2024', title: 'The Science of Meditation: Rewiring Your Brain', desc: 'Discover how daily mindfulness practices can physically change your brain structure, reducing stress and increasing focus over time.', subTags: ['Mindfulness', 'Focus'] },
  { tag: 'Neurology', date: 'June 02, 2024', title: 'Understanding Brain Fog: Causes and Solutions', desc: 'Struggling to concentrate? Learn about the physiological and environmental factors that contribute to brain fog and how to combat them.', subTags: ['Cognition', 'Health'] },
];

export default function Articles() {
  const navigate = useNavigate();
  const [heroArticle, setHeroArticle] = useState(defaultHeroArticle);
  const [articles, setArticles] = useState(defaultArticles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    articleAPI.getAll()
      .then(({ data }) => {
        if (data) {
          if (data.hero) {
            setHeroArticle({
              id: data.hero._id,
              img: data.hero.img || scenes.article2,
              title: data.hero.title,
              desc: data.hero.desc,
              tag: data.hero.category || data.hero.tag,
              date: data.hero.createdAt ? new Date(data.hero.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Featured',
            });
          }
          if (data.articles && data.articles.length > 0) {
            const mapped = data.articles.map((a) => ({
              id: a._id,
              slug: a.slug,
              tag: a.category || a.tag,
              date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : 'Recent',
              title: a.title,
              desc: a.desc,
              subTags: a.subTags || [a.category],
              views: a.views || 100,
            }));
            setArticles(mapped);
          }
        }
      })
      .catch((err) => console.warn('Could not load real articles, using defaults:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <Box sx={{ p: { xs: 0, md: 2 }, pb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.02em', mb: 1 }}>
            Health & Wellness Articles
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
            Evidence-based medical publications, clinical insights, and neuroscience research.
          </Typography>
        </Box>

        {/* Hero Section */}
        <Card
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            cursor: 'pointer',
            mb: 6,
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            '&:hover img': { transform: 'scale(1.02)' },
          }}
          onClick={() => navigate(heroArticle.id ? `/article/${heroArticle.id}` : '/article/1')}
        >
          <Box sx={{ height: { xs: 320, sm: 380, md: 450 }, width: '100%', position: 'relative' }}>
            <SmartImage
              src={heroArticle.img}
              alt="Hero"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms ease' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              }}
            />
            <Box sx={{ position: 'absolute', bottom: { xs: 16, sm: 24, md: 40 }, left: { xs: 16, sm: 24, md: 40 }, right: { xs: 16, sm: 24, md: 40 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Chip label={heroArticle.tag} sx={{ bgcolor: tokens.primary, color: '#fff', fontWeight: 700, fontSize: 11, height: 24 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{heroArticle.date}</Typography>
              </Box>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: { xs: 18, sm: 24, md: 36 },
                  lineHeight: 1.25,
                  mb: 1,
                  maxWidth: 800,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {heroArticle.title}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  lineHeight: 1.5,
                  maxWidth: 700,
                  display: { xs: '-webkit-box', sm: 'block' },
                  WebkitLineClamp: { xs: 2, sm: 'none' },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {heroArticle.desc}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* All Articles Grid */}
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#111827', mb: 3 }}>
          Latest Publications
        </Typography>

        {loading ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {articles.map((rec, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={rec.id || idx}>
                <Box
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 3,
                    p: 2.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    border: '1px solid #E5E7EB',
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: '#F9FAFB', transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' },
                  }}
                  onClick={() => navigate(`/article/${rec.id || idx + 2}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip label={rec.tag} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: 10, height: 20 }} />
                    <FiberManualRecordIcon sx={{ fontSize: 5, color: '#9CA3AF' }} />
                    <Typography sx={{ fontSize: 11, color: '#6B7280' }}>{rec.date}</Typography>
                  </Box>

                  <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.35, mb: 1.5, color: '#111827' }}>
                    {rec.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: '#4B5563',
                      lineHeight: 1.5,
                      mb: 2,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {rec.desc}
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: '#F3F4F6' }} />

                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(rec.subTags || []).map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 9, height: 18, color: '#9CA3AF', borderColor: '#E5E7EB' }} />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </PageTransition>
  );
}

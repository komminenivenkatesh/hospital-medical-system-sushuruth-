import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, Grid, Avatar } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PageTransition from '../../components/PageTransition';
import SmartImage from '../../components/SmartImage';
import { scenes, doctorPhotos } from '../../data/assets';

const articleContent = {
  title: 'ARCHITECTURE AND INTERACTION DESIGN',
  date: 'May 14, 2024',
  author: {
    name: 'JANE FOUNTAIN',
    role: 'UX/UI Designer, Interaction Designer',
    avatar: doctorPhotos.priya
  },
  paragraph1: 'Publishing by the reader. From its origins, readability is assumed. To get a feel for how to get a sense of a design. It is like you get a rough outline of the idea, but it has to be filled. I usually spend a lot of time preparing to dive into a project and try to get a feel for what the style is.\n\nWhile the main intent of this format is to allow for text blocks to be positioned creatively alongside photographs and illustrations without getting into complex table layouts or dealing with browser float issues, there are quite a few potential uses for the format. I decided to try to build a timeline since the content fits the structure well. Using the same structure I have previously used for other side-by-side elements, I’ve set it up with simple floats allowing the columns to sit alongside each other.',
  pullQuote: 'Above the clouds Gravity does not seem',
  paragraph2: 'We are no longer limited to standard grid layouts. You can mix and match different block sizes to give the page an interesting aesthetic. To see what a specific layout would look like, just check out the page!\n\nAs you can see, there is a large number of options. If you want a more complex layout, you can use the nested grid option. But remember, the more blocks you add, the more complex it becomes.',
  relatedArticles: [
    { title: 'FEBRUARY\'S FEATURED PROJECT', img: scenes.lab, category: 'FEATURED' },
    { title: 'ARCHITECTURE AND INTERACTION DESIGN', img: scenes.wellness, category: 'DESIGN' },
    { title: 'THE EVOLUTION OF ARCHITECTURE STYLE', img: scenes.article2, category: 'ARCHITECTURE' }
  ]
};

export default function Article() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Box sx={{ mx: { xs: -2, md: -4 }, mt: { xs: -2, md: -4 } }}>
        
        {/* Top Back Button */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}
            sx={{ fontWeight: 700, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
            Back
          </Button>
        </Box>

        {/* HERO SECTION */}
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 400, md: 600 }, bgcolor: '#5E54A4' }}>
          <SmartImage src={scenes.lab} alt="hero" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          {/* Blue/Purple accent block overlapping */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: -40, 
            left: 0, 
            width: { xs: '60%', md: '40%' }, 
            height: 120, 
            bgcolor: '#5E54A4',
            display: 'flex',
            alignItems: 'flex-end',
            p: 4
          }}>
            <Typography sx={{ color: '#fff', fontSize: 12, letterSpacing: 2 }}>GALAXY PROJECT</Typography>
          </Box>
        </Box>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, pt: 12, pb: 8 }}>
          <Grid container spacing={6}>
            
            {/* Sidebar (Author) */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'sticky', top: 100 }}>
                {/* Small pink box accent */}
                <Box sx={{ position: 'absolute', top: 40, left: -60, width: 40, height: 80, bgcolor: '#FF4D79', display: { xs: 'none', md: 'block' } }} />
                
                <Avatar src={articleContent.author.avatar} sx={{ width: 80, height: 80, mb: 2, borderRadius: 0 }} />
                <Typography sx={{ fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}>
                  {articleContent.author.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#666', lineHeight: 1.6, maxWidth: 120 }}>
                  {articleContent.author.role}
                </Typography>
              </Box>
            </Grid>
            
            {/* Content Column */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: 32, md: 48 }, lineHeight: 1.1, color: '#1A1A1A', mb: 2, textTransform: 'uppercase' }}>
                {articleContent.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#999', mb: 6, letterSpacing: 1 }}>
                {articleContent.date}
              </Typography>

              {/* Paragraph with Drop Cap */}
              <Box sx={{ position: 'relative', mb: 6 }}>
                <Typography component="span" sx={{ float: 'left', fontSize: 80, lineHeight: 0.8, fontWeight: 900, color: '#1A1A1A', mr: 2, mt: 1 }}>
                  P
                </Typography>
                <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: '#444' }}>
                  {articleContent.paragraph1}
                </Typography>
              </Box>

            </Grid>
          </Grid>
        </Box>

        {/* MIDDLE IMAGE & PULL QUOTE */}
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 1200, mx: 'auto', mb: 10, px: { xs: 0, md: 4 } }}>
          <Box sx={{ width: '100%', height: { xs: 300, md: 500 }, overflow: 'hidden' }}>
             <SmartImage src={scenes.wellness} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box sx={{ 
            position: { xs: 'relative', md: 'absolute' }, 
            bottom: { md: -40 }, 
            right: { md: 40 }, 
            width: { xs: '100%', md: '50%' }, 
            bgcolor: '#F5B076', 
            p: { xs: 4, md: 6 },
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <Typography sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              {articleContent.pullQuote}
            </Typography>
          </Box>
        </Box>

        {/* SECOND PARAGRAPH & SMALL IMAGE */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, mb: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 3 }}></Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: '#444', mb: 6 }}>
                {articleContent.paragraph2}
              </Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1, fontFamily: 'Georgia, serif' }}>
                    “The pursuit of wellness is an ongoing journey of mindful choices.”
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.8, color: '#666' }}>
                    A strong visual hierarchy helps guide the user's eye and makes the design much easier to comprehend. The contrast between elements is key.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* SHARE BAR */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, mb: 12 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 3 }}></Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', p: 2 }}>
                <Box sx={{ bgcolor: '#FF4D79', color: '#fff', px: 4, py: 1, fontWeight: 700, fontSize: 12, mr: 3 }}>
                  SHARE
                </Box>
                <Box sx={{ display: 'flex', gap: 3, color: '#999' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: '#1DA1F2' } }}>
                    <TwitterIcon sx={{ fontSize: 16 }} /> <Typography sx={{ fontSize: 12, fontWeight: 600 }}>115</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: '#3b5998' } }}>
                    <FacebookIcon sx={{ fontSize: 16 }} /> <Typography sx={{ fontSize: 12, fontWeight: 600 }}>243</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: '#EA4335' } }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>G+</Typography> <Typography sx={{ fontSize: 12, fontWeight: 600 }}>14</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* RELATED ARTICLES */}
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, mb: 12, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: 24, letterSpacing: 2, mb: 6, textTransform: 'uppercase' }}>
            Related Articles
          </Typography>
          <Grid container spacing={4} sx={{ position: 'relative' }}>
            {/* Small pink box accent for related articles */}
            <Box sx={{ position: 'absolute', top: '50%', left: -80, width: 40, height: 120, bgcolor: '#FF4D79', display: { xs: 'none', md: 'block' } }} />
            {articleContent.relatedArticles.map((rel, i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={i}>
                <Card sx={{ border: 'none', boxShadow: 'none', textAlign: 'left', borderRadius: 0, position: 'relative', bgcolor: 'transparent', overflow: 'visible' }}>
                  {/* Color Accent Block behind image */}
                  <Box sx={{ position: 'absolute', top: -10, left: -10, width: '80%', height: 200, bgcolor: i === 0 ? '#FF4D79' : i === 1 ? '#F5B076' : '#5E54A4', zIndex: 0 }} />
                  <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: 200, mb: 3 }}>
                    <SmartImage src={rel.img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', bottom: 10, left: 10, bgcolor: 'rgba(255,255,255,0.9)', px: 1, py: 0.5 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 800, color: i === 0 ? '#FF4D79' : i === 1 ? '#F5B076' : '#5E54A4' }}>{rel.category}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase', mb: 1 }}>
                    {rel.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#666', mb: 2, lineHeight: 1.6 }}>
                    A short description to entice readers to click and explore this related topic in detail.
                  </Typography>
                  <Button sx={{ p: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    Read More
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FOOTER / CONTACT US */}
        <Box sx={{ position: 'relative', width: '100%', py: 10, bgcolor: '#F9F9F9', backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}>
          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto', px: 4, display: 'flex', flexWrap: 'wrap', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <Box sx={{ flex: 1, minWidth: 300, bgcolor: '#FF4D79', p: 6, color: '#fff' }}>
              <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 2 }}>CONTACT US</Typography>
              <Typography sx={{ fontSize: 12, mb: 4, lineHeight: 1.8, opacity: 0.9 }}>
                Have questions or need assistance? Our team is available 24/7. Reach out and let us help.
              </Typography>
              <Typography sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, mb: 0.5 }}>Toll Free Call</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>+1 (800) 234-5678</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 300, bgcolor: '#5E54A4', p: 6, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 12, mb: 2, lineHeight: 1.8, opacity: 0.9 }}>
                Location: 1234 Medical Blvd, Innovation District, CA 90210
              </Typography>
              <Typography sx={{ fontSize: 12, mb: 4, opacity: 0.9 }}>
                Email: <Typography component="span" sx={{ fontWeight: 700 }}>contact@sushruth.io</Typography>
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FacebookIcon sx={{ fontSize: 18 }} />
                <TwitterIcon sx={{ fontSize: 18 }} />
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>
    </PageTransition>
  );
}


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw,
  ArrowLeft,
  Zap,
  Hash,
  MessageSquare,
  Calendar,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface GenerationResult {
  hooks: string[];
  captions: string[];
  hashtags: string[];
  ctas: string[];
  postingPlan: { day: string; idea: string }[];
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const { result, topic, platform, tone } = location.state as {
    result: GenerationResult;
    topic: string;
    platform: string;
    tone: string;
  } || {};

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
          <Link to="/dashboard">
            <Button variant="gradient">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({
      title: 'Copied!',
      description: `${section} copied to clipboard.`,
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadAsTxt = () => {
    const content = `
VIRALHOOK AI - Generated Content
================================
Topic: ${topic}
Platform: ${platform}
Tone: ${tone}

HOOKS (30 Scroll-Stopping Openers)
----------------------------------
${result.hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

CAPTIONS (5 High-Converting)
----------------------------
${result.captions.map((c, i) => `${i + 1}. ${c}`).join('\n\n')}

HASHTAGS (15 Trending)
----------------------
${result.hashtags.join(' ')}

CALL-TO-ACTIONS (3 Strong CTAs)
-------------------------------
${result.ctas.map((c, i) => `${i + 1}. ${c}`).join('\n')}

7-DAY POSTING PLAN
------------------
${result.postingPlan.map((p) => `${p.day}: ${p.idea}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viralhook-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: 'Content saved as text file.',
    });
  };

  const getShareText = () => {
    const hook = result.hooks[0] || '';
    const caption = result.captions[0] || '';
    const hashtags = result.hashtags.slice(0, 5).join(' ');
    return `${hook}\n\n${caption}\n\n${hashtags}`;
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const copyShareLink = async () => {
    const shareText = getShareText();
    await navigator.clipboard.writeText(shareText);
    toast({
      title: 'Copied!',
      description: 'Share text copied to clipboard.',
    });
  };

  const sections = [
    {
      title: 'Viral Hooks',
      icon: Zap,
      data: result.hooks,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Captions',
      icon: MessageSquare,
      data: result.captions,
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Hashtags',
      icon: Hash,
      data: result.hashtags,
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'Call-to-Actions',
      icon: Sparkles,
      data: result.ctas,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate New
            </Button>
            <Button variant="gradient" onClick={downloadAsTxt} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Your Viral Content</h1>
          <p className="text-muted-foreground mb-6">
            Generated for <span className="text-foreground font-medium">{topic}</span> on{' '}
            <span className="capitalize text-foreground font-medium">{platform}</span> with{' '}
            <span className="capitalize text-foreground font-medium">{tone}</span> tone
          </p>

          {/* Social Share Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToTwitter}
              className="gap-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToLinkedIn}
              className="gap-2 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/50"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToFacebook}
              className="gap-2 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/50"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyShareLink}
              className="gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Copy Text
            </Button>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-2xl shadow-card overflow-hidden"
            >
              {/* Section Header */}
              <div className={`p-4 bg-gradient-to-r ${section.color} flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-primary-foreground">
                  <section.icon className="w-5 h-5" />
                  <h2 className="font-semibold">{section.title}</h2>
                  <span className="text-sm opacity-80">({section.data.length})</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(section.data.join('\n'), section.title)}
                  className="gap-2"
                >
                  {copiedSection === section.title ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>

              {/* Section Content */}
              <div className="p-4 max-h-96 overflow-y-auto space-y-2">
                {section.data.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group flex items-start justify-between gap-3"
                  >
                    <p className="text-sm flex-1">
                      {section.title === 'Hashtags' ? item : `${i + 1}. ${item}`}
                    </p>
                    <button
                      onClick={() => copyToClipboard(item, `${section.title}-${i}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-background"
                    >
                      {copiedSection === `${section.title}-${i}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Posting Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-foreground">
              <Calendar className="w-5 h-5" />
              <h2 className="font-semibold">7-Day Posting Plan</h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(
                result.postingPlan.map(p => `${p.day}: ${p.idea}`).join('\n'),
                'Posting Plan'
              )}
              className="gap-2"
            >
              {copiedSection === 'Posting Plan' ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy All
                </>
              )}
            </Button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-7 gap-4">
            {result.postingPlan.map((plan, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <p className="font-semibold text-primary mb-2">{plan.day}</p>
                <p className="text-sm text-muted-foreground">{plan.idea}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

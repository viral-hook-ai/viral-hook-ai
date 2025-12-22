import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sparkles, 
  Loader2, 
  Instagram, 
  Youtube, 
  Music2,
  User,
  LogOut,
  Crown,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const platforms = [
  { value: 'instagram', label: 'Instagram Reels', icon: Instagram },
  { value: 'youtube', label: 'YouTube Shorts', icon: Youtube },
  { value: 'tiktok', label: 'TikTok', icon: Music2 },
];

const tones = [
  { value: 'viral', label: 'Viral' },
  { value: 'funny', label: 'Funny' },
  { value: 'educational', label: 'Educational' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'motivational', label: 'Motivational' },
];

interface GenerationResult {
  hooks: string[];
  captions: string[];
  hashtags: string[];
  ctas: string[];
  postingPlan: { day: string; idea: string }[];
}

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('viral');
  const [loading, setLoading] = useState(false);
  const [freeLimit, setFreeLimit] = useState(5);
  
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch free limit from settings
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'free_limit')
        .single();
      
      if (data) {
        setFreeLimit(parseInt(data.value as string) || 5);
      }
    };
    fetchSettings();
  }, []);

  const remainingGenerations = profile?.plan === 'pro' 
    ? 'Unlimited' 
    : Math.max(0, freeLimit - (profile?.generations_count || 0));

  const canGenerate = profile?.plan === 'pro' || 
    (profile?.generations_count || 0) < freeLimit;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a content topic or niche.',
        variant: 'destructive',
      });
      return;
    }

    if (!canGenerate) {
      toast({
        title: 'Limit Reached',
        description: 'Upgrade to Pro for unlimited generations.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { topic, platform, tone }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Save to database
      const { error: saveError } = await supabase
        .from('generations')
        .insert({
          user_id: user!.id,
          topic,
          platform,
          tone,
          hooks: data.hooks,
          captions: data.captions,
          hashtags: data.hashtags,
          ctas: data.ctas,
          posting_plan: data.postingPlan,
        });

      if (saveError) {
        console.error('Failed to save generation:', saveError);
      }

      // Update generation count
      await supabase
        .from('profiles')
        .update({ generations_count: (profile?.generations_count || 0) + 1 })
        .eq('id', user!.id);

      await refreshProfile();

      // Navigate to results
      navigate('/results', { state: { result: data, topic, platform, tone } });

    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ViralHook AI</span>
          </Link>

          <div className="flex items-center gap-4">
            {profile?.plan === 'pro' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-hero text-primary-foreground text-sm font-medium">
                <Crown className="w-4 h-4" />
                Pro
              </div>
            ) : (
              <Link to="/account">
                <Button variant="outline" size="sm" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Upgrade
                </Button>
              </Link>
            )}
            
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Usage Counter */}
          <div className="mb-8 p-4 rounded-xl glass shadow-card flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Generations Remaining</p>
              <p className="text-2xl font-bold">{remainingGenerations}</p>
            </div>
            {profile?.plan === 'free' && (
              <Link to="/account">
                <Button variant="gradient" size="sm">
                  Get Unlimited
                </Button>
              </Link>
            )}
          </div>

          {/* Generation Form */}
          <div className="glass-strong rounded-2xl shadow-card p-8">
            <h1 className="text-2xl font-bold mb-6">Generate Viral Content</h1>

            <div className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic">Content Topic / Niche</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Fitness tips, Cooking hacks, Travel vlogs..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </div>

              {/* Platform Selector */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPlatform(p.value)}
                      disabled={loading}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        platform === p.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <p.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selector */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone} disabled={loading}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleGenerate}
                disabled={loading || !canGenerate}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating viral content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </Button>

              {!canGenerate && (
                <p className="text-center text-sm text-muted-foreground">
                  You've reached your free limit.{' '}
                  <Link to="/account" className="text-primary hover:underline">
                    Upgrade to Pro
                  </Link>{' '}
                  for unlimited generations.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

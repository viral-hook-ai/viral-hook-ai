import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  ArrowLeft,
  Users,
  Zap,
  Settings,
  Save,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Admin() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalGenerations: 0 });
  const [aiPrompt, setAiPrompt] = useState('You are a viral short-form content strategist.');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      toast({
        title: 'Access Denied',
        description: 'You do not have admin access.',
        variant: 'destructive',
      });
    }
  }, [user, profile, navigate, toast]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch user count - we can count generations to estimate users
        const { count: generationsCount } = await supabase
          .from('generations')
          .select('*', { count: 'exact', head: true });

        // Fetch settings
        const { data: settings } = await supabase
          .from('app_settings')
          .select('*');

        if (settings) {
          const prompt = settings.find(s => s.key === 'ai_prompt');
          if (prompt) setAiPrompt(String(prompt.value).replace(/"/g, ''));
        }

        setStats({
          totalUsers: 0, // Would need service role to count users
          totalGenerations: generationsCount || 0,
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.is_admin) {
      fetchData();
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await supabase
        .from('app_settings')
        .update({ value: JSON.stringify(aiPrompt) })
        .eq('key', 'ai_prompt');

      toast({
        title: 'Settings Saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile?.is_admin) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Admin Panel</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-strong rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">—</p>
                  </div>
                </div>
              </div>

              <div className="glass-strong rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Generations</p>
                    <p className="text-3xl font-bold">{stats.totalGenerations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="glass-strong rounded-2xl shadow-card p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                App Settings
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aiPrompt">AI System Prompt</Label>
                  <Textarea
                    id="aiPrompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    The base prompt used for content generation
                  </p>
                </div>

                <Button 
                  variant="gradient"
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

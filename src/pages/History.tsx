import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Loader2, 
  Trash2,
  Eye,
  Clock,
  Instagram,
  Youtube,
  Music2,
  User,
  LogOut,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Generation {
  id: string;
  topic: string;
  platform: string;
  tone: string;
  hooks: string[];
  captions: string[];
  hashtags: string[];
  ctas: string[];
  posting_plan: { day: string; idea: string }[] | null;
  created_at: string;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram Reels',
  youtube: 'YouTube Shorts',
  tiktok: 'TikTok',
};

export default function History() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchGenerations();
  }, [user, navigate]);

  const fetchGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations((data || []).map(g => ({
        ...g,
        posting_plan: g.posting_plan as { day: string; idea: string }[] | null
      })));
    } catch (error: any) {
      console.error('Failed to fetch generations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load generation history.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGenerations(prev => prev.filter(g => g.id !== id));
      toast({
        title: 'Deleted',
        description: 'Generation removed from history.',
      });
    } catch (error: any) {
      console.error('Failed to delete generation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete generation.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (generation: Generation) => {
    navigate('/results', { 
      state: { 
        result: {
          hooks: generation.hooks,
          captions: generation.captions,
          hashtags: generation.hashtags,
          ctas: generation.ctas,
          postingPlan: generation.posting_plan,
        }, 
        topic: generation.topic, 
        platform: generation.platform, 
        tone: generation.tone 
      } 
    });
  };

  const filteredGenerations = generations.filter(g => 
    g.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.tone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          className="max-w-4xl mx-auto"
        >
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Generation History</h1>
              <p className="text-muted-foreground">View and manage your past content generations</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by topic, platform, or tone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredGenerations.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-2xl shadow-card p-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No results found' : 'No generations yet'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start generating viral content to see your history here'
                }
              </p>
              {!searchQuery && (
                <Link to="/dashboard">
                  <Button variant="gradient">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            /* Generations List */
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredGenerations.map((generation, index) => {
                  const PlatformIcon = platformIcons[generation.platform] || Instagram;
                  
                  return (
                    <motion.div
                      key={generation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-strong rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <PlatformIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold truncate">{generation.topic}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{platformLabels[generation.platform] || generation.platform}</span>
                                <span>•</span>
                                <span className="capitalize">{generation.tone}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Preview of hooks */}
                          {generation.hooks && generation.hooks.length > 0 && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-3 pl-13">
                              "{generation.hooks[0]}"
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(generation.created_at)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(generation)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={deletingId === generation.id}
                              >
                                {deletingId === generation.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Generation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this generation. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(generation.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Stats Summary */}
          {!loading && generations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 rounded-xl glass text-center text-sm text-muted-foreground"
            >
              {generations.length} total generation{generations.length !== 1 ? 's' : ''}
              {searchQuery && ` • ${filteredGenerations.length} matching "${searchQuery}"`}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

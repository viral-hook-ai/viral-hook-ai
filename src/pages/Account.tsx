import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Zap,
  ArrowLeft,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

export default function Account() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) return null;

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

          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ViralHook AI</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Account Info */}
          <div className="glass-strong rounded-2xl shadow-card p-8">
            <h1 className="text-2xl font-bold mb-6">Account</h1>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">Free (Unlimited)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Generations Used</p>
                  <p className="font-medium text-primary">Unlimited</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl bg-gradient-hero p-8 text-primary-foreground shadow-glow overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-bold">All Features Included</h2>
              </div>
              
              <p className="text-primary-foreground/80 mb-6">
                Enjoy unlimited access to all features — completely free!
              </p>

              <ul className="space-y-3">
                {[
                  'Unlimited content generations',
                  'Premium viral hooks',
                  'Trending hashtag analysis',
                  '7-day posting plans',
                  'All platforms supported',
                  'Export to PDF',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Logout */}
          <div className="glass-strong rounded-2xl shadow-card p-8">
            <h2 className="text-lg font-semibold mb-4">Session</h2>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

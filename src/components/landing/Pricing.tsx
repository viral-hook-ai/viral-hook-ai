import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  'Unlimited generations',
  'All platforms supported',
  'Premium viral hooks',
  'Trending hashtag analysis',
  '7-day posting plans',
  'High-converting captions',
  'Export to PDF',
  'All features included',
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready to scale your content.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl bg-gradient-hero text-primary-foreground shadow-glow max-w-lg mx-auto"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background text-foreground text-sm font-semibold flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            100% Free
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
            <p className="text-primary-foreground/80">
              All features unlocked, no credit card required
            </p>
          </div>

          <div className="mb-8 text-center">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-primary-foreground/80"> forever</span>
          </div>

          <ul className="space-y-4 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary-foreground/20">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link to="/auth">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

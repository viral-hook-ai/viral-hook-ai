import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import customer1 from '@/assets/customer-1.jpg';
import customer2 from '@/assets/customer-2.jpg';
import customer3 from '@/assets/customer-3.jpg';
import customer4 from '@/assets/customer-4.jpg';
import customer5 from '@/assets/customer-5.jpg';

const customerImages = [customer1, customer2, customer3, customer4, customer5];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const platforms = [
  { name: 'Instagram', icon: Instagram },
  { name: 'TikTok', icon: TikTokIcon },
  { name: 'YouTube', icon: Youtube },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float delay-500" />
      
      <div className="container relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Content Creation</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            Create <span className="text-gradient">Viral Reels</span>
            <br />
            in Seconds with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Generate scroll-stopping hooks, high-converting captions, trending hashtags, and complete posting plans — instantly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-3">
              {customerImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Customer ${i + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <p className="text-muted-foreground">
              Trusted by <span className="text-foreground font-semibold">10,000+</span> creators worldwide
            </p>
          </motion.div>
        </motion.div>

        {/* Platform Icons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex justify-center gap-8 flex-wrap"
        >
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-3 px-6 py-3 rounded-xl glass shadow-card"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground">
                <platform.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{platform.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

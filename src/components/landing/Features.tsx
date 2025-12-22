import { motion } from 'framer-motion';
import { Zap, Target, Hash, Calendar, Copy, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '30 Viral Hooks',
    description: 'Scroll-stopping opening lines that grab attention in the first second.',
  },
  {
    icon: Target,
    title: 'High-Converting Captions',
    description: 'Captions optimized for engagement and algorithm performance.',
  },
  {
    icon: Hash,
    title: 'Trending Hashtags',
    description: 'Relevant, trending hashtags to maximize your reach and discoverability.',
  },
  {
    icon: Sparkles,
    title: 'Strong CTAs',
    description: 'Call-to-action lines that drive followers, saves, and shares.',
  },
  {
    icon: Calendar,
    title: '7-Day Posting Plan',
    description: 'A complete week of content ideas tailored to your niche.',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy any section instantly or download everything as a file.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-subtle" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to <span className="text-gradient">Go Viral</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            One click generates a complete content strategy for any niche, any platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl glass shadow-card hover:shadow-soft transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ViralHook AI',
    features: [
      '5 generations per month',
      'All platforms supported',
      'Basic hooks & captions',
      'Standard hashtags',
      'Community support',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious creators who want to scale',
    features: [
      'Unlimited generations',
      'All platforms supported',
      'Premium viral hooks',
      'Trending hashtag analysis',
      '7-day posting plans',
      'Priority support',
      'Export to PDF',
      'Early access to new features',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-hero text-primary-foreground shadow-glow'
                  : 'glass shadow-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background text-foreground text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className={plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-primary-foreground/20' : 'bg-primary/10'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth">
                <Button
                  variant={plan.popular ? 'secondary' : 'gradient'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

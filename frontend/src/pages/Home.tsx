import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  GraduationCap,
  FileText,
  Clock,
  Bell,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Star,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  PlayCircle,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  Globe,
  Trophy,
  Rocket,
} from "lucide-react";
import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, TwitterLogoIcon } from "@phosphor-icons/react";

const Home: React.FC = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();

  const features = [
    {
      icon: FileText,
      title: "Easy Registration",
      description:
        "Simple and intuitive online registration process. Complete your application in just a few minutes.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Clock,
      title: "Quick Approval",
      description:
        "Fast application review and approval workflow. Get your results within 24-48 hours.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description:
        "Instant notifications about your application status. Stay informed every step of the way.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Your data is protected with industry-standard encryption and security measures.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Easy Management",
      description:
        "Powerful admin dashboard for efficient application review and management.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Award,
      title: "Track Progress",
      description:
        "Monitor your application status anytime, anywhere with our student portal.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description:
        "Sign up with your email and create a secure password to get started.",
      icon: Users,
    },
    {
      number: "02",
      title: "Fill Application",
      description:
        "Complete the registration form with your personal and contact details.",
      icon: FileText,
    },
    {
      number: "03",
      title: "Submit & Wait",
      description:
        "Submit your application and wait for admin review. Track status in real-time.",
      icon: Clock,
    },
    {
      number: "04",
      title: "Get Approved",
      description:
        "Receive instant notification when your application is approved.",
      icon: CheckCircle2,
    },
  ];

  const stats = [
    { value: "2,500+", label: "Students Enrolled", icon: Users },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
    { value: "15+", label: "Years Experience", icon: Award },
    { value: "100%", label: "Parent Satisfaction", icon: Heart },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Embracing modern teaching methods and technology",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: BookOpen,
      title: "Excellence",
      description: "Committed to academic and personal excellence",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Heart,
      title: "Compassion",
      description: "Nurturing caring and empathetic individuals",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "Preparing students for a connected world",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Ahmed",
      role: "Parent",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content:
        "Irshaad School has transformed my child's education. The registration was seamless and the support team is exceptional!",
      rating: 5,
    },
    {
      name: "Omar Hassan",
      role: "Parent",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content:
        "The online registration system is brilliant. I completed my son's enrollment in just 10 minutes. Highly impressed!",
      rating: 5,
    },
    {
      name: "Aisha Mohammed",
      role: "Student",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content:
        "I love how easy it was to track my application. The notifications kept me updated throughout the process.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "What grades does Irshaad School offer?",
      answer:
        "Irshaad School offers comprehensive education from kindergarten through high school (K-12), with specialized programs for each age group.",
    },
    {
      question: "How long does the registration process take?",
      answer:
        "The online registration typically takes only 5-10 minutes to complete. Application review is usually done within 24-48 hours.",
    },
    {
      question: "How will I know if my application is approved?",
      answer:
        "You will receive instant notifications via email and in-app notifications when your application status changes. You can also check your dashboard anytime.",
    },
    {
      question: "What documents are required for registration?",
      answer:
        "For initial registration, you only need basic information like student name, parent/guardian details, and contact numbers. Additional documents may be requested after approval.",
    },
    {
      question: "Is the registration platform secure?",
      answer:
        "Yes, we use industry-standard SSL encryption and security measures to protect all personal information submitted through our platform.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-32 right-20 hidden lg:block"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-20 hidden lg:block"
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="px-4 py-2 text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 border-none">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to Irshaad School of Excellence
              </Badge>
            </motion.div>

            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-2xl shadow-emerald-500/30">
                <GraduationCap className="w-14 h-14 text-white" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                Irshaad School
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Online Registration
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full text-emerald-700 dark:text-emerald-300 font-semibold text-lg">
                "Nurturing Minds, Shaping Futures"
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Join our community of learners. Register your child in minutes
              with our streamlined, secure online enrollment system.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!isAuthenticated && (
                <>
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                    asChild
                  >
                    <Link to="/register">
                      Start Registration
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg rounded-full border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    asChild
                  >
                    <Link to="/login">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Sign In
                    </Link>
                  </Button>
                </>
              )}

              {isStudent && (
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                  asChild
                >
                  <Link to="/student/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}

              {isAdmin && (
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                  asChild
                >
                  <Link to="/admin/dashboard">
                    Go to Admin Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Accredited School</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Quick Processing</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-emerald-500/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-emerald-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center text-white"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-4">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm sm:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About / Values Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 border-none">
                <Heart className="w-4 h-4 mr-2" />
                Our Values
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Why Choose{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Irshaad?
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              We are committed to providing quality education with strong values
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-teal-100 text-teal-800 border-none">
                <Zap className="w-4 h-4 mr-2" />
                Features
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Registration Made{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Simple
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Powerful features designed to make school registration effortless
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-cyan-100 text-cyan-800 border-none">
                <Target className="w-4 h-4 mr-2" />
                Process
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Works
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Four simple steps to complete your child's registration
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                )}

                <div className="text-center relative">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center mx-auto">
                      <step.icon className="h-12 w-12 text-emerald-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-none">
                <MessageSquare className="w-4 h-4 mr-2" />
                Testimonials
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              What Parents{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Say
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Trusted by thousands of families in our community
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-muted-foreground mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-orange-100 text-orange-800 border-none">
                <BookOpen className="w-4 h-4 mr-2" />
                FAQ
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to common questions about Irshaad School
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border rounded-xl mb-4 px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="max-w-5xl mx-auto overflow-hidden border-0 shadow-2xl">
                <div className="relative">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" />

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

                  <CardContent className="relative z-10 p-8 sm:p-12 md:p-16 text-center text-white">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 mb-8">
                      <GraduationCap className="w-10 h-10" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                      Join Irshaad School Today
                    </h2>
                    <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                      Give your child the education they deserve. Start the
                      registration process now and become part of our growing
                      family!
                    </p>

                    {!isAuthenticated && (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="h-14 px-8 text-lg rounded-full"
                          asChild
                        >
                          <Link to="/register">
                            Start Registration
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="h-14 px-8 text-lg rounded-full bg-transparent border-white text-white hover:bg-white/10"
                          asChild
                        >
                          <Link to="/login">Sign In</Link>
                        </Button>
                      </div>
                    )}

                    {isAuthenticated && (
                      <Button
                        size="lg"
                        variant="secondary"
                        className="h-14 px-8 text-lg rounded-full"
                        asChild
                      >
                        <Link
                          to={
                            isAdmin ? "/admin/dashboard" : "/student/dashboard"
                          }
                        >
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">Irshaad</span>
                  <p className="text-xs text-gray-400">School of Excellence</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Nurturing minds and shaping futures since 2009. Providing
                quality education with strong moral values.
              </p>
              <div className="flex gap-3">
                {[FacebookLogoIcon, TwitterLogoIcon, InstagramLogoIcon, LinkedinLogoIcon].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Home", to: "/" },
                  { label: "Register", to: "/register" },
                  { label: "Login", to: "/login" },
                  { label: "About Us", to: "#" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-4">
                {[
                  "Help Center",
                  "FAQs",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-gray-400">
                    123 Education Street, Knowledge City, KC 12345
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>+1 (234) 567-8900</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>info@irshaadschool.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Irshaad School of Excellence. All
                rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

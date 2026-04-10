import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { applicationService } from "../../services/applicationService";
import { Application, ApplicationFormData } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Users,
  Calendar,
  ArrowRight,
  Bell,
  GraduationCap,
  Sparkles,
  Send,
  AlertCircle,
  PartyPopper,
  BookOpen,
  ClipboardCheck,
  Eye,
  RefreshCw,
  ChevronRight,
  Mail,
  MapPin,
  Shield,
  Star,
  Target,
  Zap,
  Heart,
  Award,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    parentName: "",
    phoneNumber1: "",
    phoneNumber2: "",
  });

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async (): Promise<void> => {
    try {
      const response = await applicationService.getMyApplication();
      setApplication(response.application);
      setShowForm(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setShowForm(true);
      } else {
        toast.error("Failed to fetch application");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await applicationService.submitApplication(formData);
      toast.success("Application submitted successfully!");
      fetchApplication();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          title: "Application Under Review",
          description:
            "Your application is currently being reviewed by our admissions team. This usually takes 24-48 hours.",
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-200 dark:border-amber-800",
          textColor: "text-amber-700 dark:text-amber-300",
          badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
          emoji: "⏳",
        };
      case "APPROVED":
        return {
          icon: CheckCircle2,
          title: "Congratulations! You're Accepted! 🎉",
          description:
            "Welcome to Irshaad School! Your application has been approved. We look forward to having you as part of our community.",
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50 dark:bg-green-950/30",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-700 dark:text-green-300",
          badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          emoji: "🎓",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          title: "Application Not Approved",
          description:
            "We regret to inform you that your application was not approved at this time. Please contact our admissions office for more information.",
          color: "from-red-500 to-rose-500",
          bgColor: "bg-red-50 dark:bg-red-950/30",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-700 dark:text-red-300",
          badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          emoji: "😔",
        };
      default:
        return null;
    }
  };

  const timelineSteps = [
    {
      title: "Account Created",
      description: "You created your account",
      icon: User,
      completed: true,
      date: user?.createdAt,
    },
    {
      title: "Application Submitted",
      description: application ? "Your application is submitted" : "Submit your application",
      icon: FileText,
      completed: !!application,
      date: application?.createdAt,
    },
    {
      title: "Under Review",
      description: application?.status === "PENDING" ? "Currently reviewing" : "Application reviewed",
      icon: Eye,
      completed: application?.status !== undefined,
      active: application?.status === "PENDING",
    },
    {
      title: "Decision",
      description:
        application?.status === "APPROVED"
          ? "Approved!"
          : application?.status === "REJECTED"
          ? "Not approved"
          : "Awaiting decision",
      icon: application?.status === "APPROVED" ? CheckCircle2 : application?.status === "REJECTED" ? XCircle : Target,
      completed: application?.status === "APPROVED" || application?.status === "REJECTED",
      date: application?.reviewedAt,
    },
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 py-16 lg:py-20">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 bg-white/20" />
                <Skeleton className="h-5 w-48 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 -mt-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-0 shadow-lg mt-8">
            <CardContent className="p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 py-12 lg:py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-10 right-[20%] hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-[10%] hidden lg:block"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
        </motion.div>

        <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <span className="text-4xl">
                  {application?.status === "APPROVED"
                    ? "🎓"
                    : application?.status === "REJECTED"
                    ? "📚"
                    : showForm
                    ? "📝"
                    : "⏳"}
                </span>
              </motion.div>
              <div className="text-white">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl lg:text-4xl font-bold mb-1"
                >
                  {showForm
                    ? "Welcome to Irshaad!"
                    : application?.status === "APPROVED"
                    ? "Congratulations!"
                    : "Student Dashboard"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-lg"
                >
                  {user?.email}
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={fetchApplication}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link to="/student/notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {/* Quick Stats Cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-12 mb-8 relative z-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            {
              label: "Application Status",
              value: application?.status || "Not Submitted",
              icon: ClipboardCheck,
              color: application?.status === "APPROVED" 
                ? "from-green-500 to-emerald-500" 
                : application?.status === "REJECTED"
                ? "from-red-500 to-rose-500"
                : application?.status === "PENDING"
                ? "from-amber-500 to-orange-500"
                : "from-slate-500 to-slate-600",
            },
            {
              label: "Account Status",
              value: "Active",
              icon: Shield,
              color: "from-blue-500 to-indigo-500",
            },
            {
              label: "Member Since",
              value: format(new Date(), "MMM yyyy"),
              icon: Calendar,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Notifications",
              value: "View All",
              icon: Bell,
              color: "from-cyan-500 to-teal-500",
              link: "/student/notifications",
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              {stat.link ? (
                <Link to={stat.link}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-lg font-bold flex items-center gap-2">
                        {stat.value}
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {showForm ? (
                /* Application Form */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                          <FileText className="h-7 w-7" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Registration Form</h2>
                          <p className="text-white/80">
                            Fill in your details to apply for admission
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b">
                      <div className="flex items-center justify-between max-w-md mx-auto">
                        {[1, 2, 3].map((step) => (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                  currentStep >= step
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
                                    : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
                                }`}
                              >
                                {currentStep > step ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  step
                                )}
                              </div>
                              <span className="text-xs mt-2 text-muted-foreground">
                                {step === 1
                                  ? "Student Info"
                                  : step === 2
                                  ? "Contact"
                                  : "Review"}
                              </span>
                            </div>
                            {step < 3 && (
                              <div
                                className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                                  currentStep > step
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                    : "bg-slate-200 dark:bg-slate-700"
                                }`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Student Information */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <User className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Student Information</h3>
                              <p className="text-sm text-muted-foreground">
                                Enter the student's full name
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-sm font-medium">
                                Full Name <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                  id="fullName"
                                  name="fullName"
                                  placeholder="Enter student's full name"
                                  value={formData.fullName}
                                  onChange={handleInputChange}
                                  className="pl-12 h-12 rounded-xl border-2 focus:border-emerald-500 transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="parentName" className="text-sm font-medium">
                                Parent/Guardian Name <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                  id="parentName"
                                  name="parentName"
                                  placeholder="Enter parent's full name"
                                  value={formData.parentName}
                                  onChange={handleInputChange}
                                  className="pl-12 h-12 rounded-xl border-2 focus:border-emerald-500 transition-all"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <Separator />

                        {/* Contact Information */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Contact Information</h3>
                              <p className="text-sm text-muted-foreground">
                                Provide contact numbers for communication
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber1" className="text-sm font-medium">
                                Primary Phone <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-teal-500 transition-colors" />
                                <Input
                                  id="phoneNumber1"
                                  name="phoneNumber1"
                                  type="tel"
                                  placeholder="+1 (234) 567-8900"
                                  value={formData.phoneNumber1}
                                  onChange={handleInputChange}
                                  className="pl-12 h-12 rounded-xl border-2 focus:border-teal-500 transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber2" className="text-sm font-medium">
                                Secondary Phone{" "}
                                <span className="text-muted-foreground">(Optional)</span>
                              </Label>
                              <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-teal-500 transition-colors" />
                                <Input
                                  id="phoneNumber2"
                                  name="phoneNumber2"
                                  type="tel"
                                  placeholder="+1 (234) 567-8900"
                                  value={formData.phoneNumber2}
                                  onChange={handleInputChange}
                                  className="pl-12 h-12 rounded-xl border-2 focus:border-teal-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Notice */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5"
                        >
                          <div className="flex gap-4">
                            <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                                Important Notice
                              </h4>
                              <p className="text-sm text-amber-700 dark:text-amber-300">
                                Please ensure all information is accurate before submitting.
                                You won't be able to edit your application after submission.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting Application...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-5 w-5" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                application && (
                  /* Application Status & Details */
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Status Banner */}
                    {(() => {
                      const config = getStatusConfig(application.status);
                      if (!config) return null;
                      const StatusIcon = config.icon;

                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card
                            className={`border-2 ${config.borderColor} ${config.bgColor} overflow-hidden`}
                          >
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
                                <motion.div
                                  animate={
                                    application.status === "APPROVED"
                                      ? {
                                          scale: [1, 1.1, 1],
                                          rotate: [0, 5, -5, 0],
                                        }
                                      : {}
                                  }
                                  transition={{
                                    duration: 0.5,
                                    repeat: application.status === "APPROVED" ? 3 : 0,
                                  }}
                                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl flex-shrink-0`}
                                >
                                  <StatusIcon className="h-10 w-10 text-white" />
                                </motion.div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{config.emoji}</span>
                                    <Badge className={config.badgeColor}>
                                      {application.status}
                                    </Badge>
                                  </div>
                                  <h3 className={`text-2xl font-bold ${config.textColor} mb-2`}>
                                    {config.title}
                                  </h3>
                                  <p className={`${config.textColor} opacity-80`}>
                                    {config.description}
                                  </p>
                                </div>
                              </div>

                              {application.status === "APPROVED" && (
                                <div className="bg-green-100 dark:bg-green-900/50 p-4 border-t border-green-200 dark:border-green-800">
                                  <div className="flex items-center gap-3">
                                    <PartyPopper className="h-5 w-5 text-green-600" />
                                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                      Welcome to the Irshaad family! We look forward to seeing
                                      you soon.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })()}

                    {/* Application Details Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="border-0 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <CardTitle>Application Details</CardTitle>
                                <CardDescription>
                                  Your submitted application information
                                </CardDescription>
                              </div>
                            </div>
                            {(() => {
                              const config = getStatusConfig(application.status);
                              return config ? (
                                <Badge className={`${config.badgeColor} px-4 py-2`}>
                                  {application.status}
                                </Badge>
                              ) : null;
                            })()}
                          </div>
                        </CardHeader>

                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Student Name */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <Label className="text-muted-foreground text-sm">
                                  Student Name
                                </Label>
                              </div>
                              <p className="text-lg font-semibold pl-13">
                                {application.fullName}
                              </p>
                            </div>

                            {/* Parent Name */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <Label className="text-muted-foreground text-sm">
                                  Parent/Guardian
                                </Label>
                              </div>
                              <p className="text-lg font-semibold">
                                {application.parentName}
                              </p>
                            </div>

                            {/* Phone 1 */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <Label className="text-muted-foreground text-sm">
                                  Primary Contact
                                </Label>
                              </div>
                              <p className="text-lg font-semibold">
                                {application.phoneNumber1}
                              </p>
                            </div>

                            {/* Phone 2 */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                  <Phone className="h-5 w-5 text-orange-600" />
                                </div>
                                <Label className="text-muted-foreground text-sm">
                                  Secondary Contact
                                </Label>
                              </div>
                              <p className="text-lg font-semibold">
                                {application.phoneNumber2 || "Not provided"}
                              </p>
                            </div>

                            {/* Submitted Date */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                  <Calendar className="h-5 w-5 text-cyan-600" />
                                </div>
                                <Label className="text-muted-foreground text-sm">
                                  Submitted On
                                </Label>
                              </div>
                              <p className="text-lg font-semibold">
                                {format(new Date(application.createdAt), "PPP")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(application.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>

                            {/* Reviewed Date */}
                            {application.reviewedAt && (
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <Label className="text-muted-foreground text-sm">
                                    Reviewed On
                                  </Label>
                                </div>
                                <p className="text-lg font-semibold">
                                  {format(new Date(application.reviewedAt), "PPP")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(new Date(application.reviewedAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    Application Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {timelineSteps.map((step, index) => (
                      <div key={index} className="relative">
                        {index < timelineSteps.length - 1 && (
                          <div
                            className={`absolute left-5 top-12 w-0.5 h-full ${
                              step.completed
                                ? "bg-gradient-to-b from-emerald-500 to-emerald-300"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        )}
                        <div className="flex gap-4">
                          <div
                            className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              step.completed
                                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
                                : step.active
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                            }`}
                          >
                            {step.active ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <step.icon className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <step.icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <h4
                              className={`font-semibold ${
                                step.completed || step.active
                                  ? ""
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            {step.date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(step.date), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            )}
                            {step.active && (
                              <Badge
                                variant="secondary"
                                className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              >
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "View Notifications",
                      icon: Bell,
                      to: "/student/notifications",
                      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
                    },
                    {
                      label: "School Website",
                      icon: GraduationCap,
                      to: "/",
                      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
                    },
                    {
                      label: "Contact Support",
                      icon: Mail,
                      to: "#",
                      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
                    },
                  ].map((link, index) => (
                    <Link key={index} to={link.to}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group"
                      >
                        <div className={`w-8 h-8 rounded-lg ${link.color} flex items-center justify-center mr-3`}>
                          <link.icon className="h-4 w-4" />
                        </div>
                        {link.label}
                        <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Our admissions team is here to help you with any questions.
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applicationService } from "../../services/applicationService";
import { Application, ApplicationStats } from "../../types";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "sonner";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  BarChart3,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  Filter,
  Download,
  Calendar,
  Mail,
  Phone,
  User,
  ChevronRight,
  Activity,
  Sparkles,
  GraduationCap,
  Shield,
  AlertCircle,
  PartyPopper,
  ClipboardList,
  UserCheck,
  UserX,
  Inbox,
  Settings,
  Bell,
  PieChart,
  Target,
  Zap,
  Award,
} from "lucide-react";
import { format, formatDistanceToNow, subDays, isAfter } from "date-fns";

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [appsResponse, statsResponse] = await Promise.all([
        applicationService.getAllApplications(activeTab),
        applicationService.getApplicationStats(),
      ]);
      setApplications(appsResponse.applications);
      setStats(statsResponse.stats);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<void> => {
    setProcessingId(id);
    try {
      await applicationService.updateApplicationStatus(id, status);
      toast.success(`Application ${status.toLowerCase()} successfully`);
      fetchData();
      setShowDetailModal(false);
    } catch (error) {
      toast.error("Failed to update application status");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter applications based on search
  const filteredApplications = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phoneNumber1.includes(searchQuery)
  );

  // Recent applications (last 7 days)
  const recentApplications = applications.filter((app) =>
    isAfter(new Date(app.createdAt), subDays(new Date(), 7))
  );

  // Calculate trends (mock data for demonstration)
  const trends = {
    total: { value: 12, isUp: true },
    pending: { value: 5, isUp: true },
    approved: { value: 8, isUp: true },
    rejected: { value: 2, isUp: false },
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
          label: "Pending Review",
          icon: Clock,
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          textColor: "text-amber-700 dark:text-amber-300",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50 dark:bg-green-950/30",
          textColor: "text-green-700 dark:text-green-300",
          badgeClass: "bg-green-100 text-green-800 border-green-200",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          color: "from-red-500 to-rose-500",
          bgColor: "bg-red-50 dark:bg-red-950/30",
          textColor: "text-red-700 dark:text-red-300",
          badgeClass: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          icon: FileText,
          color: "from-slate-500 to-slate-600",
          bgColor: "bg-slate-50",
          textColor: "text-slate-700",
          badgeClass: "bg-slate-100 text-slate-800",
        };
    }
  };

  // Loading State
  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 lg:py-16">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-2xl bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-white/20" />
                <Skeleton className="h-5 w-64 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Stats Skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-12 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 lg:py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-10 right-[15%] hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-[25%] hidden lg:block"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        </motion.div>
        <motion.div
          className="absolute top-20 left-[10%] hidden lg:block"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
        </motion.div>

        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <GraduationCap className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </motion.div>
              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-1">
                  Admin Dashboard
                </h1>
                <p className="text-white/80 text-lg">
                  Manage applications for Irshaad School
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-12 mb-8 relative z-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            {
              title: "Total Applications",
              value: stats?.total || 0,
              icon: ClipboardList,
              color: "from-blue-500 to-indigo-500",
              bgColor: "bg-blue-50 dark:bg-blue-950/30",
              trend: trends.total,
            },
            {
              title: "Pending Review",
              value: stats?.pending || 0,
              icon: Clock,
              color: "from-amber-500 to-orange-500",
              bgColor: "bg-amber-50 dark:bg-amber-950/30",
              trend: trends.pending,
            },
            {
              title: "Approved",
              value: stats?.approved || 0,
              icon: UserCheck,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50 dark:bg-green-950/30",
              trend: trends.approved,
            },
            {
              title: "Rejected",
              value: stats?.rejected || 0,
              icon: UserX,
              color: "from-red-500 to-rose-500",
              bgColor: "bg-red-50 dark:bg-red-950/30",
              trend: trends.rejected,
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor} overflow-hidden group`}
              >
                <CardContent className="p-6 relative">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      >
                        <stat.icon className="h-7 w-7 text-white" />
                      </div>
                      {stat.trend && (
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${
                            stat.trend.isUp ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.trend.isUp ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {stat.trend.value}%
                        </div>
                      )}
                    </div>
                    <p className="text-4xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Applications Table */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>Applications</CardTitle>
                        <CardDescription>
                          {filteredApplications.length} total applications
                        </CardDescription>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full sm:w-64 rounded-full border-2"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="px-6 pt-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
                      <TabsList className="bg-white dark:bg-slate-800 shadow-sm p-1 rounded-xl">
                        {[
                          { value: "ALL", label: "All", count: stats?.total },
                          { value: "PENDING", label: "Pending", count: stats?.pending },
                          { value: "APPROVED", label: "Approved", count: stats?.approved },
                          { value: "REJECTED", label: "Rejected", count: stats?.rejected },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-lg px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                          >
                            {tab.label}
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-white/20"
                            >
                              {tab.count || 0}
                            </Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="m-0">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                        </div>
                      ) : filteredApplications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-6 shadow-xl">
                              <Inbox className="h-12 w-12 text-slate-400" />
                            </div>
                          </motion.div>
                          <h3 className="text-xl font-bold mb-2">
                            No Applications Found
                          </h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            {searchQuery
                              ? `No applications match "${searchQuery}"`
                              : activeTab === "ALL"
                              ? "There are no applications yet."
                              : `There are no ${activeTab.toLowerCase()} applications.`}
                          </p>
                          {searchQuery && (
                            <Button
                              variant="outline"
                              className="mt-4 rounded-full"
                              onClick={() => setSearchQuery("")}
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                <TableHead className="font-semibold">
                                  Applicant
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Contact Info
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Status
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Date
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <AnimatePresence>
                                {filteredApplications.map((app, index) => {
                                  const config = getStatusConfig(app.status);
                                  const StatusIcon = config.icon;

                                  return (
                                    <motion.tr
                                      key={app.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                    >
                                      <TableCell>
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                            {app.fullName.charAt(0).toUpperCase()}
                                          </div>
                                          <div>
                                            <p className="font-semibold">
                                              {app.fullName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {app.parentName}
                                            </p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="truncate max-w-[150px]">
                                              {app.user?.email}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />
                                            {app.phoneNumber1}
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`${config.badgeClass} border flex items-center gap-1 w-fit`}
                                        >
                                          <StatusIcon className="h-3 w-3" />
                                          {config.label}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">
                                            {format(
                                              new Date(app.createdAt),
                                              "MMM d, yyyy"
                                            )}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(
                                              new Date(app.createdAt),
                                              { addSuffix: true }
                                            )}
                                          </p>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                          {app.status === "PENDING" ? (
                                            <>
                                              <Button
                                                size="sm"
                                                className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md"
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    app.id,
                                                    "APPROVED"
                                                  )
                                                }
                                                disabled={processingId === app.id}
                                              >
                                                {processingId === app.id ? (
                                                  <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                  <>
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                    Approve
                                                  </>
                                                )}
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                className="rounded-full shadow-md"
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    app.id,
                                                    "REJECTED"
                                                  )
                                                }
                                                disabled={processingId === app.id}
                                              >
                                                {processingId === app.id ? (
                                                  <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                  <>
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                  </>
                                                )}
                                              </Button>
                                            </>
                                          ) : (
                                            <div className="text-sm text-muted-foreground text-right">
                                              <p>Reviewed</p>
                                              {app.reviewedAt && (
                                                <p className="text-xs">
                                                  {format(
                                                    new Date(app.reviewedAt),
                                                    "MMM d"
                                                  )}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                              setSelectedApplication(app);
                                              setShowDetailModal(true);
                                            }}
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </motion.tr>
                                  );
                                })}
                              </AnimatePresence>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Approval Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Approval Rate
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {stats?.total
                          ? Math.round(
                              ((stats.approved || 0) / stats.total) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            stats?.total
                              ? ((stats.approved || 0) / stats.total) * 100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Pending Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Pending Review
                      </span>
                      <span className="text-lg font-bold text-amber-600">
                        {stats?.total
                          ? Math.round(
                              ((stats.pending || 0) / stats.total) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            stats?.total
                              ? ((stats.pending || 0) / stats.total) * 100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Stats List */}
                  <div className="space-y-4">
                    {[
                      {
                        label: "This Week",
                        value: recentApplications.length,
                        icon: Calendar,
                        color: "text-blue-600 bg-blue-100",
                      },
                      {
                        label: "Needs Action",
                        value: stats?.pending || 0,
                        icon: AlertCircle,
                        color: "text-amber-600 bg-amber-100",
                      },
                      {
                        label: "Completed Today",
                        value: applications.filter(
                          (a) =>
                            a.reviewedAt &&
                            format(new Date(a.reviewedAt), "yyyy-MM-dd") ===
                              format(new Date(), "yyyy-MM-dd")
                        ).length,
                        icon: CheckCircle2,
                        color: "text-green-600 bg-green-100",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}
                          >
                            <item.icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className="text-xl font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 5).map((app, index) => {
                    const config = getStatusConfig(app.status);
                    const StatusIcon = config.icon;

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetailModal(true);
                        }}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                        >
                          {app.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {app.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(app.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <StatusIcon className={`h-4 w-4 ${config.textColor}`} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    );
                  })}

                  {applications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No recent applications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Admin Tips 💡</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Review pending applications promptly to provide a better
                      experience for applicants. Aim to respond within 24-48 hours.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white/90">
                        {stats?.pending || 0} applications need your attention
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <div
                  className={`bg-gradient-to-br ${
                    getStatusConfig(selectedApplication.status).color
                  } p-8 rounded-t-3xl`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                      {selectedApplication.fullName.charAt(0)}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">
                        {selectedApplication.fullName}
                      </h2>
                      <p className="text-white/80">
                        {selectedApplication.user?.email}
                      </p>
                      <Badge
                        className={`mt-2 ${
                          getStatusConfig(selectedApplication.status).badgeClass
                        }`}
                      >
                        {getStatusConfig(selectedApplication.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setShowDetailModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Parent/Guardian",
                      value: selectedApplication.parentName,
                      icon: Users,
                    },
                    {
                      label: "Primary Phone",
                      value: selectedApplication.phoneNumber1,
                      icon: Phone,
                    },
                    {
                      label: "Secondary Phone",
                      value: selectedApplication.phoneNumber2 || "N/A",
                      icon: Phone,
                    },
                    {
                      label: "Applied On",
                      value: format(
                        new Date(selectedApplication.createdAt),
                        "PPP"
                      ),
                      icon: Calendar,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Application Timeline
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(selectedApplication.createdAt),
                            "PPp"
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedApplication.status === "APPROVED"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {selectedApplication.status === "APPROVED" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {selectedApplication.status === "APPROVED"
                              ? "Approved"
                              : "Rejected"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(selectedApplication.reviewedAt),
                              "PPp"
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedApplication.status === "PENDING" && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 rounded-xl h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, "APPROVED")
                      }
                      disabled={processingId === selectedApplication.id}
                    >
                      {processingId === selectedApplication.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Approve Application
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-xl h-12"
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, "REJECTED")
                      }
                      disabled={processingId === selectedApplication.id}
                    >
                      {processingId === selectedApplication.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject Application
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { applicationService } from "../../services/applicationService";
import { Application, ApplicationStats } from "../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner";
import {
  ClipboardList,
  Clock,
  UserCheck,
  UserX,
  RefreshCw,
  ArrowRight,
  Inbox,
  AlertCircle,
  BarChart3,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUploadUrl } from "../../lib/uploads";

const statusBadge: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
};

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        applicationService.getAllApplications("ALL"),
        applicationService.getApplicationStats(),
      ]);
      setApplications(appsRes.applications);
      setStats(statsRes.stats);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    toast.success("Dashboard refreshed");
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Online registration overview for Irshaad School
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Applications",
            value: stats?.total ?? 0,
            icon: ClipboardList,
            color: "from-slate-700 to-slate-900",
          },
          {
            title: "Pending Review",
            value: stats?.pending ?? 0,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
          },
          {
            title: "Approved",
            value: stats?.approved ?? 0,
            icon: UserCheck,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "Rejected",
            value: stats?.rejected ?? 0,
            icon: UserX,
            color: "from-rose-500 to-red-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Needs attention</CardTitle>
              <CardDescription>
                Pending applications awaiting review
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link to="/admin/applications">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApps.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No pending applications</p>
              </div>
            ) : (
              pendingApps.slice(0, 6).map((app) => {
                const photo = getUploadUrl(app.photoUrl);
                return (
                  <Link
                    key={app.id}
                    to="/admin/applications"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={app.fullName}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                        {app.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{app.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {app.user?.email}
                      </p>
                      {(app.photoUrl || app.documentUrl) && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-700">
                          {app.photoUrl && (
                            <span className="inline-flex items-center gap-0.5">
                              <ImageIcon className="h-3 w-3" /> Photo
                            </span>
                          )}
                          {app.documentUrl && (
                            <span className="inline-flex items-center gap-0.5">
                              <FileText className="h-3 w-3" /> Doc
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={statusBadge.PENDING}>Pending</Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(app.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl h-11"
                asChild
              >
                <Link to="/admin/applications">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Review applications
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl h-11"
                asChild
              >
                <Link to="/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
            <CardContent className="p-5">
              <p className="text-sm text-emerald-100 mb-1">Pending queue</p>
              <p className="text-3xl font-bold mb-2">{stats?.pending ?? 0}</p>
              <p className="text-sm text-emerald-100">
                Aim to review new registrations within 24–48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

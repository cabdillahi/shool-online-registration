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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
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
  Search,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Calendar,
  Inbox,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import ApplicationFiles from "../../components/ApplicationFiles";
import { getUploadUrl } from "../../lib/uploads";

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
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
    } catch {
      toast.error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Applications refreshed");
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
    } catch {
      toast.error("Failed to update application status");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phoneNumber1.includes(searchQuery)
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending Review",
          icon: Clock,
          color: "from-amber-500 to-orange-500",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          color: "from-emerald-500 to-teal-600",
          badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          color: "from-rose-500 to-red-600",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
        };
      default:
        return {
          label: status,
          icon: FileText,
          color: "from-slate-500 to-slate-600",
          badgeClass: "bg-slate-100 text-slate-800",
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Applications
          </h1>
          <p className="text-slate-500 mt-1">
            Review and manage student registration submissions
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

      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="border-b bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>All applications</CardTitle>
                <CardDescription>
                  {filteredApplications.length} shown
                </CardDescription>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 sm:px-6 pt-4 border-b bg-slate-50/80">
              <TabsList className="bg-white shadow-sm p-1 rounded-xl">
                {[
                  { value: "ALL", label: "All", count: stats?.total },
                  { value: "PENDING", label: "Pending", count: stats?.pending },
                  {
                    value: "APPROVED",
                    label: "Approved",
                    count: stats?.approved,
                  },
                  {
                    value: "REJECTED",
                    label: "Rejected",
                    count: stats?.rejected,
                  },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-lg px-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    {tab.label}
                    <Badge variant="secondary" className="ml-2 bg-white/20">
                      {tab.count || 0}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Inbox className="h-12 w-12 mb-4 opacity-40" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    No applications found
                  </h3>
                  <p className="text-sm">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : "There are no applications in this filter."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Applicant</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => {
                        const config = getStatusConfig(app.status);
                        const StatusIcon = config.icon;
                        const photo = getUploadUrl(app.photoUrl);

                        return (
                          <TableRow key={app.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt={app.fullName}
                                    className="w-10 h-10 rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                    {app.fullName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold">{app.fullName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {app.parentName}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="truncate max-w-[160px]">
                                    {app.user?.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5" />
                                  {app.phoneNumber1}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <ApplicationFiles
                                photoUrl={app.photoUrl}
                                documentUrl={app.documentUrl}
                                compact
                              />
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
                              <p className="text-sm font-medium">
                                {format(new Date(app.createdAt), "MMM d, yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(app.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                {app.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="rounded-full bg-emerald-600 hover:bg-emerald-700"
                                      onClick={() =>
                                        handleStatusUpdate(app.id, "APPROVED")
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
                                      className="rounded-full"
                                      onClick={() =>
                                        handleStatusUpdate(app.id, "REJECTED")
                                      }
                                      disabled={processingId === app.id}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full"
                                  onClick={() => {
                                    setSelectedApplication(app);
                                    setShowDetailModal(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`bg-gradient-to-br ${
                  getStatusConfig(selectedApplication.status).color
                } p-6 rounded-t-2xl relative`}
              >
                <div className="flex items-center gap-4">
                  {getUploadUrl(selectedApplication.photoUrl) ? (
                    <img
                      src={getUploadUrl(selectedApplication.photoUrl)!}
                      alt={selectedApplication.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedApplication.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="text-white">
                    <h2 className="text-xl font-bold">
                      {selectedApplication.fullName}
                    </h2>
                    <p className="text-white/80 text-sm">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setShowDetailModal(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
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
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-slate-50 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <p className="font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <ApplicationFiles
                  photoUrl={selectedApplication.photoUrl}
                  documentUrl={selectedApplication.documentUrl}
                />

                {selectedApplication.status === "PENDING" && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedApplication.id,
                          "APPROVED"
                        )
                      }
                      disabled={processingId === selectedApplication.id}
                    >
                      {processingId === selectedApplication.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-xl h-11"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedApplication.id,
                          "REJECTED"
                        )
                      }
                      disabled={processingId === selectedApplication.id}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Reject
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

export default AdminApplications;

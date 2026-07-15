import React, { useEffect, useRef, useState } from "react";
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
  BarChart3,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardList,
  TrendingUp,
  Calendar,
  Printer,
  PieChart,
} from "lucide-react";
import { format, subDays, isAfter, startOfMonth, isWithinInterval } from "date-fns";

const AdminReports: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [appsRes, statsRes] = await Promise.all([
          applicationService.getAllApplications("ALL"),
          applicationService.getApplicationStats(),
        ]);
        setApplications(appsRes.applications);
        setStats(statsRes.stats);
      } catch {
        toast.error("Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const thisWeek = applications.filter((a) =>
    isAfter(new Date(a.createdAt), subDays(new Date(), 7))
  ).length;

  const thisMonth = applications.filter((a) =>
    isWithinInterval(new Date(a.createdAt), {
      start: startOfMonth(new Date()),
      end: new Date(),
    })
  ).length;

  const approvalRate =
    stats && stats.total > 0
      ? Math.round((stats.approved / stats.total) * 100)
      : 0;

  const generatedAt = format(new Date(), "PPP 'at' p");

  const exportCsv = () => {
    if (!applications.length) {
      toast.error("No applications to export");
      return;
    }

    const headers = [
      "No",
      "Full Name",
      "Parent Name",
      "Email",
      "Phone 1",
      "Phone 2",
      "Status",
      "Submitted At",
      "Reviewed At",
    ];

    const rows = applications.map((a, index) =>
      [
        index + 1,
        a.fullName,
        a.parentName,
        a.user?.email ?? "",
        a.phoneNumber1,
        a.phoneNumber2 ?? "",
        a.status,
        format(new Date(a.createdAt), "yyyy-MM-dd HH:mm"),
        a.reviewedAt
          ? format(new Date(a.reviewedAt), "yyyy-MM-dd HH:mm")
          : "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registration-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const statusBreakdown = [
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Approved",
      value: stats?.approved ?? 0,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      color: "bg-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Screen-only toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 print:hidden"
      >
        <div>
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Reports
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Registration Reports
          </h1>
          <p className="text-slate-500 mt-1">
            Summary analytics and printable registration tables
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportCsv}
            className="rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={handlePrint}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </motion.div>

      {/* Screen-only summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {[
          {
            title: "Total Applications",
            value: stats?.total ?? 0,
            icon: ClipboardList,
            accent: "from-slate-700 to-slate-900",
          },
          {
            title: "This Week",
            value: thisWeek,
            icon: Calendar,
            accent: "from-teal-500 to-emerald-600",
          },
          {
            title: "This Month",
            value: thisMonth,
            icon: TrendingUp,
            accent: "from-cyan-500 to-teal-600",
          },
          {
            title: "Approval Rate",
            value: `${approvalRate}%`,
            icon: PieChart,
            accent: "from-emerald-500 to-green-600",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center mb-4`}
                >
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500 mt-1">{card.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 print:hidden">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-emerald-600" />
              Status Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of all registration applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {statusBreakdown.map((item) => {
              const pct =
                stats && stats.total > 0
                  ? Math.round((item.value / stats.total) * 100)
                  : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}
                      >
                        <item.icon className={`h-4 w-4 ${item.text}`} />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.value}</Badge>
                      <span className="text-sm text-slate-500 w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Printer className="h-5 w-5 text-emerald-600" />
              Print & Export
            </CardTitle>
            <CardDescription>
              Generate a standard printable registration report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print full report with tables
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={exportCsv}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV spreadsheet
            </Button>
            <p className="text-xs text-slate-500 pt-1">
              The print layout includes a school header, summary table, and full
              applications register.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Printable report document */}
      <div
        ref={printRef}
        className="print-report bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print:shadow-none print:border-0 print:rounded-none"
      >
        {/* Report header */}
        <div className="border-b-2 border-slate-800 px-6 py-5 print:px-0 print:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">
                Irshaad School
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Online Student Registration Report
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Official applications register
              </p>
            </div>
            <div className="text-sm text-slate-600 sm:text-right space-y-1">
              <p>
                <span className="font-medium text-slate-800">Generated:</span>{" "}
                {generatedAt}
              </p>
              <p>
                <span className="font-medium text-slate-800">Total records:</span>{" "}
                {stats?.total ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8 print:px-0">
          {/* Summary table */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-3 border-b border-slate-300 pb-2">
              1. Summary Statistics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm report-table">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                      Metric
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-right font-semibold">
                      Count
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-right font-semibold">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-3 py-2">
                      Total Applications
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {stats?.total ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      100%
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2">
                      Pending Review
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {stats?.pending ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      {stats?.total
                        ? Math.round(((stats.pending || 0) / stats.total) * 100)
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-2">
                      Approved
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {stats?.approved ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      {stats?.total
                        ? Math.round(
                            ((stats.approved || 0) / stats.total) * 100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2">
                      Rejected
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {stats?.rejected ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      {stats?.total
                        ? Math.round(
                            ((stats.rejected || 0) / stats.total) * 100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-2">
                      Submitted This Week
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {thisWeek}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      —
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2">
                      Submitted This Month
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right font-medium">
                      {thisMonth}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      —
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-2 font-semibold">
                      Approval Rate
                    </td>
                    <td
                      className="border border-slate-300 px-3 py-2 text-right font-semibold"
                      colSpan={2}
                    >
                      {approvalRate}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Applications register table */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-3 border-b border-slate-300 pb-2">
              2. Applications Register
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm report-table">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold w-10">
                      No.
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Student Name
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Parent / Guardian
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Email
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Phone
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Status
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Submitted
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                      Reviewed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-slate-300 px-3 py-8 text-center text-slate-500"
                      >
                        No applications recorded.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app, index) => (
                      <tr
                        key={app.id}
                        className={index % 2 === 1 ? "bg-slate-50" : undefined}
                      >
                        <td className="border border-slate-300 px-2 py-1.5 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 font-medium">
                          {app.fullName}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5">
                          {app.parentName}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5">
                          {app.user?.email ?? "—"}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5">
                          {app.phoneNumber1}
                          {app.phoneNumber2 ? ` / ${app.phoneNumber2}` : ""}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5">
                          {app.status}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 whitespace-nowrap">
                          {format(new Date(app.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 whitespace-nowrap">
                          {app.reviewedAt
                            ? format(new Date(app.reviewedAt), "dd/MM/yyyy")
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sign-off block for printed copies */}
          <section className="pt-6 print:pt-10">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-4 border-b border-slate-300 pb-2">
              3. Authorization
            </h3>
            <div className="grid sm:grid-cols-2 gap-10 text-sm text-slate-700">
              <div>
                <p className="mb-10">Prepared by:</p>
                <div className="border-b border-slate-400 w-56 mb-1" />
                <p className="text-xs text-slate-500">Name &amp; Signature</p>
                <p className="text-xs text-slate-500 mt-4">Date: _______________</p>
              </div>
              <div>
                <p className="mb-10">Approved by:</p>
                <div className="border-b border-slate-400 w-56 mb-1" />
                <p className="text-xs text-slate-500">
                  Admissions Officer / Administrator
                </p>
                <p className="text-xs text-slate-500 mt-4">Date: _______________</p>
              </div>
            </div>
          </section>

          <p className="text-[10px] text-slate-400 pt-4 border-t border-slate-200">
            This document was generated from the Irshaad School Online
            Registration System. For official use only.
          </p>
        </div>
      </div>

      {/* Screen preview note under table (redundant with cards above on small screens) */}
      <div className="print:hidden">
        <Card className="border-0 shadow-sm bg-slate-50">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-600">
              The table above is the printable report layout. Use{" "}
              <span className="font-semibold">Print Report</span> for a clean
              page without the admin chrome.
            </p>
            <Button
              size="sm"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shrink-0"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { notificationService } from "../../services/notificationService";
import { Notification, NotificationType } from "../../types";
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Inbox,
  Info,
  MailOpen,
  MessageSquare,
  Sparkles,
  Trash2,
  XCircle,
  RefreshCw,
  AlertCircle,
  PartyPopper,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface GroupedNotifications {
  [key: string]: Notification[];
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (): Promise<void> => {
    try {
      const response = await notificationService.getMyNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
    toast.success("Notifications refreshed");
  };

  const handleMarkAsRead = async (id: string): Promise<void> => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((notif) => ({ ...notif, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.isRead;
    if (activeTab === "read") return notif.isRead;
    return true;
  });

  // Group notifications by date
  const groupNotificationsByDate = (notifs: Notification[]): GroupedNotifications => {
    return notifs.reduce((groups: GroupedNotifications, notification) => {
      const date = parseISO(notification.createdAt);
      let key: string;

      if (isToday(date)) {
        key = "Today";
      } else if (isYesterday(date)) {
        key = "Yesterday";
      } else {
        key = format(date, "MMMM d, yyyy");
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notification);
      return groups;
    }, {});
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  // Stats
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;
  const successCount = notifications.filter((n) => n.type === "SUCCESS").length;
  const errorCount = notifications.filter((n) => n.type === "ERROR").length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        );
      case "ERROR":
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <XCircle className="h-6 w-6 text-white" />
          </div>
        );
      case "INFO":
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Info className="h-6 w-6 text-white" />
          </div>
        );
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    const opacity = isRead ? "bg-opacity-50" : "";
    switch (type) {
      case "SUCCESS":
        return `bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/20 border-green-200 dark:border-green-800 ${opacity}`;
      case "ERROR":
        return `bg-gradient-to-r from-red-50 to-rose-50/50 dark:from-red-950/30 dark:to-rose-950/20 border-red-200 dark:border-red-800 ${opacity}`;
      case "INFO":
      default:
        return `bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 ${opacity}`;
    }
  };

  const getNotificationEmoji = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "🎉";
      case "ERROR":
        return "😔";
      case "INFO":
      default:
        return "📢";
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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notifications Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bell className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">Notifications</h1>
                    <p className="text-white/80 mt-1">
                      Stay updated with your application status
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="rounded-full"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="rounded-full"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 mb-8 relative z-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            {
              label: "Total",
              value: totalCount,
              icon: Bell,
              color: "from-slate-500 to-slate-600",
              bgColor: "bg-slate-50 dark:bg-slate-900",
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: AlertCircle,
              color: "from-amber-500 to-orange-500",
              bgColor: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Approved",
              value: successCount,
              icon: PartyPopper,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50 dark:bg-green-950/30",
            },
            {
              label: "Rejected",
              value: errorCount,
              icon: XCircle,
              color: "from-red-500 to-rose-500",
              bgColor: "bg-red-50 dark:bg-red-950/30",
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}`}>
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <TabsList className="bg-white dark:bg-gray-800 shadow-md p-1 rounded-2xl">
                <TabsTrigger
                  value="all"
                  className="rounded-xl px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  All
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {totalCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="rounded-xl px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="read"
                  className="rounded-xl px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white"
                >
                  <MailOpen className="h-4 w-4 mr-2" />
                  Read
                  <Badge variant="secondary" className="ml-2">
                    {readCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <AnimatePresence mode="wait">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="flex flex-col items-center justify-center py-20">
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {activeTab === "unread" ? (
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
                              <CheckCircle2 className="h-12 w-12 text-white" />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center mb-6 shadow-xl">
                              <Inbox className="h-12 w-12 text-white" />
                            </div>
                          )}
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3">
                          {activeTab === "unread"
                            ? "All Caught Up! 🎉"
                            : activeTab === "read"
                            ? "No Read Notifications"
                            : "No Notifications Yet"}
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md leading-relaxed">
                          {activeTab === "unread"
                            ? "You've read all your notifications. Great job staying on top of things!"
                            : activeTab === "read"
                            ? "You haven't read any notifications yet."
                            : "You don't have any notifications yet. We'll notify you when there's something important."}
                        </p>
                        {activeTab !== "all" && (
                          <Button
                            variant="outline"
                            className="mt-6 rounded-full"
                            onClick={() => setActiveTab("all")}
                          >
                            View All Notifications
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {Object.entries(groupedNotifications).map(([date, notifs], groupIndex) => (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                      >
                        {/* Date Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <Clock className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-muted-foreground">
                              {date}
                            </span>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-3">
                          {notifs.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.01, x: 4 }}
                              className="group"
                            >
                              <Card
                                className={`border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${getNotificationBg(
                                  notification.type,
                                  notification.isRead
                                )} ${notification.isRead ? "opacity-75" : ""}`}
                              >
                                <CardContent className="p-0">
                                  <div className="flex items-start gap-4 p-5">
                                    {/* Icon */}
                                    <motion.div
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      className="flex-shrink-0"
                                    >
                                      {getNotificationIcon(notification.type)}
                                    </motion.div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-2xl">
                                            {getNotificationEmoji(notification.type)}
                                          </span>
                                          {!notification.isRead && (
                                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 animate-pulse">
                                              <Sparkles className="h-3 w-3 mr-1" />
                                              New
                                            </Badge>
                                          )}
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {formatDistanceToNow(parseISO(notification.createdAt), {
                                            addSuffix: true,
                                          })}
                                        </span>
                                      </div>

                                      <p className={`text-sm leading-relaxed ${notification.isRead ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                                        {notification.message}
                                      </p>

                                      <div className="flex items-center justify-between mt-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {format(parseISO(notification.createdAt), "EEEE, MMM d 'at' h:mm a")}
                                        </p>

                                        {!notification.isRead && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-950"
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Mark as read
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="hidden sm:flex flex-col items-center gap-2">
                                      {notification.isRead ? (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                          <MailOpen className="h-4 w-4 text-slate-400" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Bottom Accent Line */}
                                  {!notification.isRead && (
                                    <div
                                      className={`h-1 ${
                                        notification.type === "SUCCESS"
                                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                          : notification.type === "ERROR"
                                          ? "bg-gradient-to-r from-red-500 to-rose-500"
                                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                                      }`}
                                    />
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Tips Section */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">💡 Pro Tip</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Keep your notifications organized by marking them as read once you've reviewed them. 
                      This helps you quickly identify new updates about your application status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
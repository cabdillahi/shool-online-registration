import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { 
  GraduationCap, 
  Bell, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Home,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const getInitials = (email: string): string => {
    return email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 print:hidden",
          isScrolled 
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800" 
            : "bg-transparent"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <GraduationCap className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Irshaad
                </span>
                <span className="text-[10px] lg:text-xs text-muted-foreground font-medium tracking-wider uppercase">
                  School of Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Navigation Links */}
              <div className="flex items-center space-x-1 mr-4">
                <Button 
                  variant={isActive('/') ? 'secondary' : 'ghost'} 
                  asChild
                  className="rounded-full px-4"
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>

                {isAuthenticated ? (
                  <>
                    {isStudent && (
                      <>
                        <Button 
                          variant={isActive('/student/dashboard') ? 'secondary' : 'ghost'} 
                          asChild
                          className="rounded-full px-4"
                        >
                          <Link to="/student/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button 
                          variant={isActive('/student/notifications') ? 'secondary' : 'ghost'} 
                          asChild
                          className="rounded-full px-4 relative"
                        >
                          <Link to="/student/notifications">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              3
                            </span>
                          </Link>
                        </Button>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <Button 
                          variant={isActive('/admin/dashboard') || isActive('/admin/applications') ? 'secondary' : 'ghost'} 
                          asChild
                          className="rounded-full px-4"
                        >
                          <Link to="/admin/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </Button>
                        <Button 
                          variant={isActive('/admin/reports') ? 'secondary' : 'ghost'} 
                          asChild
                          className="rounded-full px-4"
                        >
                          <Link to="/admin/reports">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Reports
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                ) : null}
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-12 rounded-full pl-3 pr-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                          {user?.email ? getInitials(user.email) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start mr-2">
                        <span className="text-sm font-semibold">
                          {user?.email?.split('@')[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-t-md -m-1 mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-lg font-bold">
                            {user?.email ? getInitials(user.email) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none">{user?.email?.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 w-fit">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="py-3 px-4 cursor-pointer">
                      <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}>
                        <LayoutDashboard className="mr-3 h-4 w-4 text-emerald-600" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="py-3 px-4 cursor-pointer">
                        <Link to="/admin/reports">
                          <BarChart3 className="mr-3 h-4 w-4 text-emerald-600" />
                          Reports
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isStudent && (
                      <DropdownMenuItem asChild className="py-3 px-4 cursor-pointer">
                        <Link to="/student/notifications">
                          <Bell className="mr-3 h-4 w-4 text-emerald-600" />
                          Notifications
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="py-3 px-4 cursor-pointer">
                      <Settings className="mr-3 h-4 w-4 text-emerald-600" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="py-3 px-4 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="rounded-full px-6 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button 
                    asChild 
                    className="rounded-full px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800"
        >
          <div className="px-4 py-6 space-y-3">
            {/* Mobile Logo */}
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Irshaad School
                </span>
                <span className="text-xs text-muted-foreground">School of Excellence</span>
              </div>
            </div>

            {/* Navigation Links */}
            <Button variant="ghost" asChild className="w-full justify-start h-12 rounded-xl">
              <Link to="/">
                <Home className="mr-3 h-5 w-5 text-emerald-600" />
                Home
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                {isStudent && (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start h-12 rounded-xl">
                      <Link to="/student/dashboard">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-emerald-600" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start h-12 rounded-xl">
                      <Link to="/student/notifications">
                        <Bell className="mr-3 h-5 w-5 text-emerald-600" />
                        Notifications
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          3
                        </span>
                      </Link>
                    </Button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start h-12 rounded-xl">
                      <Link to="/admin/dashboard">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-emerald-600" />
                        Admin Panel
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start h-12 rounded-xl">
                      <Link to="/admin/reports">
                        <BarChart3 className="mr-3 h-5 w-5 text-emerald-600" />
                        Reports
                      </Link>
                    </Button>
                  </>
                )}

                {/* User Info */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                        {user?.email ? getInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">{user?.role}</p>
                    </div>
                  </div>

                  <Button 
                    variant="destructive" 
                    onClick={handleLogout} 
                    className="w-full h-12 rounded-xl"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-4 space-y-3">
                <Button variant="outline" asChild className="w-full h-12 rounded-xl">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20 print:hidden" />
    </>
  );
};

export default Navbar;
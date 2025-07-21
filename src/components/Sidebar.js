import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;
const minimizedDrawerWidth = 60;

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [openTasks, setOpenTasks] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };


  const handleToggleTasks = () => {
    setOpenTasks(!openTasks);
  };

  const handleMenuHover = (menu) => {
    setHoveredMenu(menu);
  };

  const handleMenuLeave = () => {
    setHoveredMenu(null);
  };

  const isActive = (path) => {
    return currentPath === path;
  };

  // Fungsi untuk menentukan apakah parent menu harus dibuka
  const shouldParentBeOpen = (routes) => {
    return routes.some(route => isActive(route));
  };

  // Jika path saat ini termasuk dalam submenu tasks, buka tasks
  React.useEffect(() => {
    const taskRoutes = ['/tasks/task_list', '/tasks/task_calendar'];
    if (taskRoutes.some(route => isActive(route))) {
      setOpenTasks(true);
    }

  }, [currentPath]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isMinimized ? minimizedDrawerWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMinimized ? minimizedDrawerWidth : drawerWidth,
            boxSinking: 'border-box',
            backgroundColor: '#0F1035',
            color: '#fff',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMinimized ? 'center' : 'flex-start',
            padding: isMinimized ? 0 : '0 16px',
          }}
        >
          <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          {!isMinimized && (
            <Typography variant="h6" noWrap component="div" sx={{ marginLeft: '8px' }}>
              To-Do App
            </Typography>
          )}
        </Toolbar>
        <List sx={{ width: '100%' }}>
          {/* Dashboard Link */}
          <ListItem disablePadding sx={{ width: '100%', display: 'block' }}>
            <Link href="/home" passHref legacyBehavior>
              <ListItemButton
                component="a"
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: !isMinimized ? 'flex-start' : 'center',
                  px: 2,
                  color: '#fff',
                  '&:hover': { backgroundColor: 'secondary.main' },
                  backgroundColor: isActive('/home') ? 'secondary.main' : 'inherit',
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#fff',
                  minWidth: 'auto',
                  mr: !isMinimized ? 2 : 0
                }}>
                  <DashboardIcon />
                </ListItemIcon>
                {!isMinimized && <ListItemText primary="Home" />}
              </ListItemButton>
            </Link>
          </ListItem>

          {/* Tasks Section */}
          <ListItem 
            disablePadding 
            sx={{ width: '100%', display: 'block' }}
            onMouseEnter={() => handleMenuHover('tasks')}
            onMouseLeave={handleMenuLeave}
          >
            <ListItemButton
              onClick={handleToggleTasks}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: !isMinimized ? 'flex-start' : 'center',
                px: 2,
                color: '#fff',
                '&:hover': { backgroundColor: 'secondary.main' },
                backgroundColor: shouldParentBeOpen(['/tasks/task_list', '/tasks/task_calendar']) 
                  ? 'secondary.main' 
                  : 'inherit',
              }}
            >
              <ListItemIcon sx={{ 
                color: '#fff',
                minWidth: 'auto',
                mr: !isMinimized ? 2 : 0
              }}>
                <ListAltIcon />
              </ListItemIcon>
              {!isMinimized && <ListItemText primary="Tasks" />}
              {!isMinimized && (openTasks ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={openTasks || (hoveredMenu === 'tasks' && isMinimized)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ width: '100%' }}>
              {[
                { text: 'List', icon: <AssignmentIcon />, route: '/tasks/task_list' },
                { text: 'Calendar', icon: <EventIcon />, route: '/tasks/task_calendar' },
              ].map(({ text, icon, route }) => (
                <ListItem key={text} disablePadding sx={{ width: '100%', display: 'block' }}>
                  <Link href={route} passHref legacyBehavior>
                    <ListItemButton
                      component="a"
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: isMinimized ? 'center' : 'flex-start', // Sejajar vertikal hanya saat diminimalkan
                        justifyContent: isMinimized ? 'center' : 'flex-start', // Posisi konten saat diminimalkan
                        px: isMinimized ? 2 : 4, // Padding horizontal berbeda saat diminimalkan
                        py: 1.5, // Padding vertikal seragam
                        color: '#fff',
                        '&:hover': { backgroundColor: 'info.main' },
                        backgroundColor: isActive(route) ? 'info.main' : 'inherit',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: '#fff',
                          minWidth: 'auto',
                          mr: !isMinimized ? 2 : 0, // Margin kanan hanya saat tidak diminimalkan
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      {!isMinimized && <ListItemText primary={text} />}
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </Box>
  );
}
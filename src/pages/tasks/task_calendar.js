import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskDetails from '../../components/TaskDetails';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const localizer = momentLocalizer(moment);
const MAX_EVENTS_DISPLAY = 100;
// Komponen YearView dengan kontrol Year
const YearView = ({ events, onSelectEvent, currentYear, onYearChange }) => {
  const months = moment.months();
  return (
    <Box>
      {/* Kontrol Year */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={currentYear}
            onChange={(e) => onYearChange(e.target.value)}
            label="Year"
          >
            {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {months.map((month, index) => {
          const monthEvents = events.filter(event => 
            moment(event.start).month() === index && 
            moment(event.start).year() === currentYear
          );

          const displayedEvents = monthEvents;
          const hiddenEvents = monthEvents.length - displayedEvents.length;

          return (
            <Paper key={month} elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>{month}</Typography>
              {monthEvents.length > 0 ? (
                <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                  {displayedEvents.map(event => (
                    <Typography 
                      key={event.id} 
                      variant="body2" 
                      onClick={() => onSelectEvent(event)}
                      sx={{ 
                        mb: 1,
                        p: 0.5,
                        backgroundColor: getEventColor(event.category),
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      {moment(event.start).format('D')}: {event.title}
                    </Typography>
                  ))}
                  {hiddenEvents > 0 && (
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => onSelectEvent({ month, events: monthEvents })}
                    >
                      +{hiddenEvents} more
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No events
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

const CustomToolbar = (toolbar) => {
  const [selectedMonth, setSelectedMonth] = useState(moment(toolbar.date).month());
  const [selectedYear, setSelectedYear] = useState(moment(toolbar.date).year());
  const [selectedDate, setSelectedDate] = useState(moment(toolbar.date).date());

  const months = moment.months();
  const years = Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i);
  const days = Array.from({ length: moment(toolbar.date).daysInMonth() }, (_, i) => i + 1);

  // Sinkronisasi bulan, tahun, dan tanggal saat toolbar.date berubah
  useEffect(() => {
    setSelectedMonth(moment(toolbar.date).month());
    setSelectedYear(moment(toolbar.date).year());
    setSelectedDate(moment(toolbar.date).date());
  }, [toolbar.date]);

  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToToday = () => toolbar.onNavigate('TODAY');

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    const newDate = moment(toolbar.date).month(newMonth).toDate();
    toolbar.onNavigate('DATE', newDate);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    const newDate = moment(toolbar.date).year(newYear).toDate();
    toolbar.onNavigate('DATE', newDate);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    const updatedDate = moment(toolbar.date).date(newDate).toDate();
    toolbar.onNavigate('DATE', updatedDate);
  };

  return (
    <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mb: 2,
    p: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 1,
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Button variant="outlined" onClick={goToBack}>
      Back
    </Button>

    {/* Dropdown Date, Month, Year di tengah */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {toolbar.view === 'day' && (
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Date</InputLabel>
          <Select value={selectedDate} onChange={handleDateChange} label="Date">
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Month</InputLabel>
        <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
          {months.map((month, index) => (
            <MenuItem key={month} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select value={selectedYear} onChange={handleYearChange} label="Year">
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <Button variant="outlined" onClick={goToNext}>
      Next
    </Button>
  </Box>
</Box>
  );
};

const EventComponent = ({ event, view }) => {
  return (
    <Paper 
  elevation={3} 
  sx={{ 
    padding: '4px', 
    backgroundColor: getEventColor(event.category),
    color: 'white',
    borderRadius: '4px',
    height: '100%',
    overflow: 'hidden',
    maxHeight: 100, // Batas tinggi maksimal
    position: 'relative', // Untuk menempatkan "+X more" di bagian bawah
  }}
>
      <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>
        {event.title}
      </Typography>
      
    </Paper>
  );
};

const getEventColor = (category) => {
  switch (category) {
    case 'Work':
      return '#1976d2';
    case 'Personal':
      return '#ff9800';
    case 'Urgent':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

const CategoryLegend = () => {
  const categories = [
    { name: 'Work', color: getEventColor('Work') },
    { name: 'Personal', color: getEventColor('Personal') },
    { name: 'Urgent', color: getEventColor('Urgent') }
  ];

  return (
    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Category:
      </Typography>
      {categories.map((category) => (
        <Box
          key={category.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: category.color,
              borderRadius: '50%',
            }}
          />
          <Typography variant="body2">{category.name}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function TaskCalendar() {
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', etc.
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/get_todos_calendar');
        const data = await response.json();
        if (data.success) {
          const formattedEvents = data.data.map(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
  
            return {
              id: event.id,
              title: event.title,
              start: new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                startDate.getHours(),
                startDate.getMinutes()
              ),
              end: new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                endDate.getHours(),
                endDate.getMinutes()
              ),
              description: event.description,
              category: event.category,
            };
          });
  
          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch events:', data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [view, setView] = useState('month');
  const [currentYear, setCurrentYear] = useState(moment().year());

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Task Calendar
      </Typography>
      
      {/* Tabs untuk memilih view */}
      <Tabs 
        value={view} 
        onChange={(e, newValue) => setView(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Year" value="year" />
        <Tab label="Month" value="month" />
        <Tab label="Week" value="week" />
        <Tab label="Day" value="day" />
        <Tab label="Agenda" value="agenda" />
      </Tabs>

      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        {view === 'year' ? (
          <YearView 
            events={events} 
            onSelectEvent={handleSelectEvent}
            currentYear={currentYear}
            onYearChange={handleYearChange}
          />
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            components={{
              event: ({ event }) => <EventComponent event={event} view={view} />,
              toolbar: CustomToolbar
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: getEventColor(event.category),
                color: 'white',
                border: 'none',
                overflowY: 'auto',
              },
            })}
            view={view}
            onView={() => {}}
            views={{
              month: true,
              week: true,
              day: true,
              agenda: true
            }}
            popup // Aktifkan popup untuk tampilan bulan
            onSelectSlot={() => {}} // Pastikan tidak ada konflik
            onDrillDown={() => {}} // Pastikan tidak ada konflik
            toolbar={true}
          />

        )}
      </Box>

      {/* Dialog untuk detail event */}
      {selectedEvent && (
        <TaskDetails
          open={openDialog}
          task={{
            ...selectedEvent,
            start_time: moment(selectedEvent.start).format('YYYY-MM-DD HH:mm:ss'), // Format sesuai backend
            end_time: moment(selectedEvent.end).format('YYYY-MM-DD HH:mm:ss'), // Format sesuai backend
            dueDate: moment(selectedEvent.start).format('YYYY-MM-DD'),
            status: selectedEvent.status || 'Incomplete',
          }}
          onClose={handleCloseDialog}
          onSave={async (updatedTask) => {
            try {
              // Panggil API untuk menyimpan perubahan
              const response = await fetch('/api/edit_task', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
              });
        
              const result = await response.json();
        
              if (!response.ok) {
                throw new Error(result.message || 'Failed to update task');
              }
        
              // Tampilkan Snackbar sukses
              setSnackbarMessage('Task updated successfully!');
              setSnackbarSeverity('success');
              setSnackbarOpen(true);
        
              setOpenDialog(false); // Tutup dialog setelah berhasil
            } catch (error) {
              console.error('Error updating task:', error.message);
        
              // Tampilkan Snackbar error
              setSnackbarMessage('Failed to update task. Please try again.');
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
            }
          }}
        />
      )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} // Durasi tampilan Snackbar
          onClose={handleSnackbarClose} // Fungsi untuk menutup Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posisi di bagian atas tengah
          sx={{ 
            width: '50%', // Lebar Snackbar
            maxWidth: '600px', // Batas maksimal lebar
            margin: '0 auto', // Pusatkan secara horizontal
          }}
        >
          <MuiAlert 
            severity={snackbarSeverity} 
            onClose={handleSnackbarClose} // Tambahkan tombol silang
            sx={{ 
              width: '100%', 
              fontSize: '1.2rem', 
              padding: '16px', 
              textAlign: 'center', // Pusatkan teks
            }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <CategoryLegend />
    </Box>
  );
}
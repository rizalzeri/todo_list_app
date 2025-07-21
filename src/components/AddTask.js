import React, { useState } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { CalendarToday, Category, Description, AccessTime } from '@mui/icons-material';

export default function AddTask({ open, onClose, onAdd }) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    status: 'Incomplete',
    start_hours: '',
    end_hours: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState({}); // State untuk validasi
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar control

  const handleChange = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' })); // Reset error saat field diubah
  };

  const validate = () => {
    const newErrors = {};

    if (!newTask.title) newErrors.title = 'Title is required';
    if (!newTask.category) newErrors.category = 'Category is required';
    if (!newTask.dueDate) newErrors.dueDate = 'Due Date is required';
    if (newTask.start_hours === '') newErrors.start_hours = 'Start Time is required';
    if (newTask.end_hours === '') newErrors.end_hours = 'End Time is required';

    if (newTask.start_hours !== '' && newTask.end_hours !== '') {
      if (newTask.start_hours === newTask.end_hours) {
        newErrors.start_hours = 'Start Time and End Time cannot be the same';
        newErrors.end_hours = 'Start Time and End Time cannot be the same';
      } else if (parseInt(newTask.start_hours, 10) >= parseInt(newTask.end_hours, 10)) {
        newErrors.start_hours = 'Start Time must be earlier than End Time';
        newErrors.end_hours = 'End Time must be later than Start Time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true jika tidak ada error
  };

  const handleAdd = async () => {
    if (!validate()) return; // Jika validasi gagal, hentikan proses

    const start_time = `${newTask.dueDate} ${String(newTask.start_hours).padStart(2, '0')}:00`;
    const end_time = `${newTask.dueDate} ${String(newTask.end_hours).padStart(2, '0')}:00`;
    const formattedDueDate = new Date(newTask.dueDate).toISOString().split('T')[0];

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      due_date: formattedDueDate,
      start_time,
      end_time,
      position: 1,
      category_id: getCategoryID(newTask.category),
      status_id: getStatusID(newTask.status),
      category: newTask.category,
      status: newTask.status,
    };

    try {
      const response = await fetch('/api/add_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const result = await response.json();
        const uiFormattedTask = {
          ...taskData,
          id: result.id,
          dueDate: formattedDueDate,
        };

        onAdd(uiFormattedTask);
        setOpenSnackbar(true); // Tampilkan notifikasi
        onClose(); // Tutup modal
      } else {
        console.error('Failed to add task:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const getCategoryID = (category) => {
    switch (category) {
      case 'Work': return 1;
      case 'Personal': return 2;
      case 'Urgent': return 3;
      default: return 0;
    }
  };

  const getStatusID = (status) => {
    switch (status) {
      case 'Complete': return 1;
      case 'Incomplete': return 2;
      default: return 0;
    }
  };

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        sx={{ '& .MuiDialog-paper': { width: '100%' } }}
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 2 }}>
            <CalendarToday color="primary" />
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newTask.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Description color="primary" />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Category color="primary" />
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              select
              value={newTask.category}
              onChange={(e) => handleChange('category', e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
            >
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 2 }}>
            <AccessTime color="primary" />
            <TextField
              label="Start Time"
              variant="outlined"
              fullWidth
              select
              value={newTask.start_hours}
              onChange={(e) => handleChange('start_hours', e.target.value)}
              error={!!errors.start_hours}
              helperText={errors.start_hours}
            >
              {hoursOptions.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}:00
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="End Time"
              variant="outlined"
              fullWidth
              select
              value={newTask.end_hours}
              onChange={(e) => handleChange('end_hours', e.target.value)}
              error={!!errors.end_hours}
              helperText={errors.end_hours}
            >
              {hoursOptions.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}:00
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CalendarToday color="primary" />
            <TextField
              label="Due Date"
              variant="outlined"
              fullWidth
              type="date"
              value={newTask.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: '50%' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ 
            width: '100%', 
            fontSize: '1.2rem', 
            padding: '16px', 
            backgroundColor: '#4caf50', 
            color: '#ffffff' 
          }}
        >
          Task added successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
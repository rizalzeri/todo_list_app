import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button 
} from '@mui/material';
import { CalendarToday, Category, Description, CheckCircle, PendingActions, AccessTime } from '@mui/icons-material';
import EditTask from './EditTask'; // Impor komponen EditTask

export default function TaskDetails({ open, task, onClose, onSave }) {
  const [editableTask, setEditableTask] = useState(task);
  const [isEditMode, setIsEditMode] = useState(false);

  // Update local state when task changes
  React.useEffect(() => {
    setEditableTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editableTask);
    setIsEditMode(false);
  };

  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${formattedHour}.00 ${period}`;
  };

  if (!editableTask) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={{ '& .MuiDialog-paper': { width: '100%' } }}
    >
      <DialogTitle>{isEditMode ? 'Edit Task Details' : 'Task Details'}</DialogTitle>
      <DialogContent sx={{ marginTop: 1 }}>
        {isEditMode ? (
          <EditTask editableTask={editableTask} onChange={setEditableTask} />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 2 }}>
              <CalendarToday color="primary" />
              <Typography variant="body1">{editableTask.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Description color="primary" />
              <Typography variant="body1">{editableTask.description}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Category color="primary" />
              <Typography variant="body1">{editableTask.category}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {editableTask.status === 'Completed' ? <CheckCircle color="success" /> : <PendingActions color="warning" />}
              <Typography variant="body1">{editableTask.status}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccessTime color="primary" />
              <Typography variant="body1">
                Start: {formatTime(parseInt(editableTask.start_time.slice(11, 13), 10))}
              </Typography>
              <Typography variant="body1">
                End: {formatTime(parseInt(editableTask.end_time.slice(11, 13), 10))}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CalendarToday color="primary" />
              <Typography variant="body1">Due Date: {editableTask.dueDate}</Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {isEditMode ? (
          <>
            <Button onClick={() => setIsEditMode(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSave} color="primary">Save</Button>
          </>
        ) : (
          <>
            <Button onClick={onClose} color="secondary">Close</Button>
            <Button 
              onClick={() => setIsEditMode(true)} 
              color="primary" 
              disabled={editableTask.status === 'Completed'} // Disable tombol jika status Completed
            >
              Edit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
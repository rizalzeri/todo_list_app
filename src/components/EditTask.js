import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { CalendarToday, Category, Description, AccessTime } from '@mui/icons-material';

export default function EditTask({ editableTask, onChange }) {
  const handleChange = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const categories = ['Work', 'Personal', 'Urgent']; // Dropdown options for Category

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 2 }}>
        <CalendarToday color="primary" />
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={editableTask.title}
          onChange={(e) => handleChange('title', e.target.value)}
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
          value={editableTask.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Category color="primary" />
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          select // Menjadikan TextField sebagai dropdown
          value={editableTask.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 2 }}>
        <AccessTime color="primary" />
        <TextField
          label="Start Time"
          variant="outlined"
          fullWidth
          type="time"
          value={editableTask.start_time?.slice(11, 16) || ''}
          onChange={(e) => {
            const date = editableTask.start_time?.slice(0, 10) || new Date().toISOString().slice(0, 10);
            const time = e.target.value;
            handleChange('start_time', `${date} ${time}`);
          }}
        />
        <TextField
          label="End Time"
          variant="outlined"
          fullWidth
          type="time"
          value={editableTask.end_time?.slice(11, 16) || ''}
          onChange={(e) => {
            const date = editableTask.end_time?.slice(0, 10) || new Date().toISOString().slice(0, 10);
            const time = e.target.value;
            handleChange('end_time', `${date} ${time}`);
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CalendarToday color="primary" />
        <TextField
          label="Due Date"
          variant="outlined"
          fullWidth
          type="date"
          value={editableTask.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
    </>
  );
}
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Typography
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';

function TableRowComponent({ task, handleStatusChange, handleRowClick }) {
  return (
    <TableRow
      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#e8f5e9' } }}
    >
      <TableCell sx={{ p: 0.5, display: 'flex', alignItems: 'center' }}>
        <Radio
          checked
          onChange={() => handleStatusChange(task)}
          color="primary"
        />
        <UndoIcon
          sx={{ cursor: 'pointer', ml: 1, color: '#1976d2' }}
          onClick={() => handleStatusChange(task)}
        />
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        <Typography sx={{ textDecoration: 'line-through' }}>
          {task.title}
        </Typography>
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        <Typography
          sx={{
            bgcolor:
              task.category === 'Work' ? '#1976d2' :
              task.category === 'Personal' ? '#ff9800' :
              task.category === 'Urgent' ? '#f44336' :
              '#9e9e9e',
            color: 'white',
            px: 1,
            borderRadius: 1,
            textDecoration: 'line-through',
            display: 'inline-block',
          }}
        >
          {task.category}
        </Typography>
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        <Typography sx={{ textDecoration: 'line-through' }}>
          {task.dueDate}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default function CompletedTask({ tasks, handleStatusChange, handleRowClick }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        mb: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#f8fff8',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#c8e6c9' }}>
            <TableCell>Status</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRowComponent
              key={task.id}
              task={task}
              handleStatusChange={handleStatusChange}
              handleRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
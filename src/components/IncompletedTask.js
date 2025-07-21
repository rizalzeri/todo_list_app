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
  Typography,
  IconButton,
} from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import { Delete } from '@mui/icons-material';

const ItemTypes = {
  TASK: 'task',
};

function TableRowComponent({ task, handleStatusChange, handleRowClick, index, moveTask, handleDelete }) {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(item.id, task.id); // Tetap gunakan ID untuk identifikasi
      item.index = hoverIndex; // Update posisi drag
    },
  });

  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: '#ffebee' },
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <TableCell sx={{ p: 0.5 }}>
        <Radio
          checked={false}
          onChange={() => handleStatusChange(task)}
          color="primary"
        />
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        {task.title}
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        <Typography
          sx={{
            bgcolor:
              task.category === 'Work'
                ? '#1976d2'
                : task.category === 'Personal'
                ? '#ff9800'
                : task.category === 'Urgent'
                ? '#f44336'
                : '#9e9e9e',
            color: 'white',
            px: 1,
            borderRadius: 1,
            display: 'inline-block',
          }}
        >
          {task.category}
        </Typography>
      </TableCell>
      <TableCell sx={{ p: 1 }} onClick={() => handleRowClick(task)}>
        {task.dueDate}
      </TableCell>
      <TableCell sx={{ p: 1 }}>
        <IconButton onClick={() => handleDelete(task.id)} color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default function IncompletedTask({
  tasks,
  handleStatusChange,
  handleRowClick,
  moveTask,
  handleDelete,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        mb: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#fff8f8',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#ffcdd2' }}>
            <TableCell>Status</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRowComponent
              key={task.id}
              task={task}
              index={index}
              handleStatusChange={handleStatusChange}
              handleRowClick={handleRowClick}
              moveTask={moveTask}
              handleDelete={handleDelete} // Tambahkan handleDelete
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
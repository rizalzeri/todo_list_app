import React from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  IconButton, 
  InputAdornment, 
  Typography,
  Button
} from '@mui/material';
import { Search, Sort } from '@mui/icons-material';
import { DragIndicator } from '@mui/icons-material'; 

export default function TaskFilters({
  showIncompleteFilters = true,
  showCompletedFilters = true,
  incompleteSearchTerm,
  setIncompleteSearchTerm,
  incompleteCategoryFilter,
  setIncompleteCategoryFilter,
  completedSearchTerm,
  setCompletedSearchTerm,
  completedCategoryFilter,
  setCompletedCategoryFilter,
  tasksPerPage,
  setTasksPerPage,
  sortConfig,
  requestSort,
  onResetSort
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {/* Incomplete Tasks Filters */}
      {showIncompleteFilters && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle2">Incomplete Tasks Filters</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search Incomplete"
              variant="outlined"
              size="small"
              value={incompleteSearchTerm}
              onChange={(e) => setIncompleteSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={incompleteCategoryFilter}
                label="Category"
                onChange={(e) => setIncompleteCategoryFilter(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Work">Work</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Completed Tasks Filters */}
      {showCompletedFilters && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle2">Completed Tasks Filters</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search Completed"
              variant="outlined"
              size="small"
              value={completedSearchTerm}
              onChange={(e) => setCompletedSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={completedCategoryFilter}
                label="Category"
                onChange={(e) => setCompletedCategoryFilter(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Work">Work</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      {/* Sort and Reset */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">Sort by:</Typography>

        {/* tombol sort dueDate */}
        <IconButton onClick={() => requestSort('dueDate')} size="small">
          <Sort />
          <Typography variant="body2">
            Due Date {sortConfig?.key === 'dueDate'
              ? (sortConfig.direction === 'asc' ? '↑' : '↓')
              : ''}
          </Typography>
        </IconButton>

        {/* tombol reset (drag order) */}
        <IconButton onClick={onResetSort} size="small" title="Default Order">
          <DragIndicator />
          <Typography variant="body2">
            Default Order{sortConfig?.key === 'pos_id' ? '↕' : ''}
          </Typography>
        </IconButton>
      </Box>

      <FormControl size="small" sx={{ minWidth: 120, ml: 'auto' }}>
        <InputLabel>Tasks per page</InputLabel>
        <Select
          value={tasksPerPage}
          label="Tasks per page"
          onChange={(e) => setTasksPerPage(Number(e.target.value))}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Pagination,
  PaginationItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import AddTask from '../../components/AddTask'; 
import DeleteTask from '../../components/DeleteTask';
import TaskFilters from '../../components/TaskFilters';
import TaskDetails from '../../components/TaskDetails';
import IncompletedTask from '../../components/IncompletedTask';
import CompletedTask from '../../components/CompletedTask';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragIndicator } from '@mui/icons-material'; 
import { Add } from '@mui/icons-material'; 
import { Delete } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileDownload } from '@mui/icons-material'; 
import IconButton from '@mui/material/IconButton';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const handleExportToExcel = async () => {
  try {
    const response = await fetch('/api/get_todos');
    const result = await response.json();

    if (!result.success) throw new Error('Failed to fetch data for export');

    const data = result.data;
    const formattedData = data.map(task => ({
      ID: task.id,
      Position: task.pos_id,
      Title: task.title,
      Category: task.category,
      'Due Date': task.duedate,
      Status: task.status,
      Description: task.description,
      'Start Time': task.start_time,
      'End Time': task.end_time,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'Tasks.xlsx');
  } catch (error) {
    console.error('Export failed:', error.message);
    setSnackbarMessage('Failed to export tasks.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};
export default function Tasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [incompleteSearchTerm, setIncompleteSearchTerm] = useState('');
  const [incompleteCategoryFilter, setIncompleteCategoryFilter] = useState('All');
  const [completedSearchTerm, setCompletedSearchTerm] = useState('');
  const [completedCategoryFilter, setCompletedCategoryFilter] = useState('All');
  const [pageNumberIncomplete, setPageNumberIncomplete] = useState(1);
  const [pageNumberCompleted, setPageNumberCompleted] = useState(1);
  const [tasksPerPageIncomplete, setTasksPerPageIncomplete] = useState(5);
  const [tasksPerPageCompleted, setTasksPerPageCompleted] = useState(5);
  const [sortConfigIncomplete, setSortConfigIncomplete] = useState({key: 'pos_id',direction: 'asc'});
  const [sortConfigCompleted, setSortConfigCompleted] = useState({key: 'pos_id',direction: 'asc'});
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', etc.
  const [selectedFile, setSelectedFile] = useState(null); // State untuk menyimpan file yang dipilih

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Simpan file yang dipilih
    }
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      // Panggil fungsi handleExcelUpload dengan file yang dipilih
      handleExcelUpload(selectedFile);
      setSelectedFile(null); // Reset file setelah upload
    }
  };
  
  const handleExcelUpload = async (file) => {
    if (!file) return;
  
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const newTasks = jsonData.map((row, index) => {
        const parseExcelDate = (excelValue) => {
          if (typeof excelValue === 'number') {
            const totalMilliseconds = (excelValue - 25569) * 86400 * 1000;
            const date = new Date(Math.round(totalMilliseconds));
            return date.toISOString().slice(0, 19).replace('T', ' ');
          } else if (typeof excelValue === 'string') {
            const date = new Date(excelValue);
            return isNaN(date) ? null : date.toISOString().slice(0, 19).replace('T', ' ');
          } else {
            return null;
          }
        };
        const start_time = parseExcelDate(row['Start Time']);
        const end_time = parseExcelDate(row['End Time']);
        const due_date = parseExcelDate(row['Due Date']);
  
        return {
          title: row['Title'],
          description: row['Description'],
          due_date,
          start_time,
          end_time,
          position: allTasks.length + index + 1,
          category_id: getCategoryID(row['Category']),
          status_id: getStatusID('Incomplete'),
          category: row['Category'],
          status: 'Incomplete',
        };
      });
  
      // Kirim data ke backend
      for (const task of newTasks) {
        const response = await fetch('/api/add_task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to add task: ${response.statusText}`);
        }
      }
  
      // Tampilkan snackbar sukses
      setSnackbarMessage('Tasks imported successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Refresh halaman setelah sukses
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Tunggu 2 detik sebelum refresh
    } catch (error) {
      console.error('Error importing tasks:', error.message);
      setSnackbarMessage('Failed to import tasks. Check the file format.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
  const handleAddTask = (newTask) => {
    setAllTasks((prevTasks) => [...prevTasks, newTask]); // Tambahkan task baru ke allTasks
    setFilteredTasks((prevTasks) => [...prevTasks, newTask]); // Tambahkan task baru ke filteredTasks
  };
  const handleDeleteTask = async (taskId) => {
    try {
      // Kirim permintaan DELETE ke API
      const response = await fetch('/api/delete_task', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete task');
      }

      // Jika berhasil, perbarui state
      const updatedTasks = allTasks.filter(task => task.id !== taskId);
      setAllTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      // Tampilkan Snackbar jika berhasil
      setSnackbarMessage('Task deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting task:', error.message);

      // Tampilkan Snackbar jika gagal
      setSnackbarMessage('Failed to delete task. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleSave = async (updatedTask) => {
    try {
      // Kirim permintaan PUT ke API untuk memperbarui task
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
  
      // Perbarui state allTasks dan filteredTasks
      const updatedTasks = allTasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );
      setAllTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
  
      // Tampilkan Snackbar jika berhasil
      setSnackbarMessage('Task updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Tutup dialog setelah Snackbar ditampilkan
      setTimeout(() => {
        setOpenDialog(false);
        setSelectedTask(null);
      }, 500); // Tambahkan jeda waktu agar Snackbar muncul lebih dulu
    } catch (error) {
      console.error('Error updating task:', error.message);
  
      // Tampilkan Snackbar jika gagal
      setSnackbarMessage('Failed to update task. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setOpenDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    handleDeleteTask(taskToDelete);
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('/api/get_todos');
        const data = await res.json();
        if (data.success) {
          const formattedTasks = data.data.map(task => ({
            ...task,
            dueDate: task.duedate.split('T')[0], // ambil tanggal saja tanpa membuat Date object
          }));
          
          setAllTasks(formattedTasks);
          setFilteredTasks(formattedTasks); // Set filteredTasks dengan data awal
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchTodos();
  }, []);
  useEffect(() => {
    let resultTasks = [...allTasks];
    
    if (searchTerm) {
      resultTasks = resultTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'All') {
      resultTasks = resultTasks.filter(task => task.status === statusFilter);
    }
    
    if (categoryFilter !== 'All') {
      resultTasks = resultTasks.filter(task => task.category === categoryFilter);
    }
    
    if (sortConfig.key) {
      resultTasks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTasks(resultTasks);
  }, [allTasks, searchTerm, statusFilter, categoryFilter, sortConfig]);

  const resetSortIncomplete = () => {
    setSortConfigIncomplete({ key: 'pos_id', direction: 'asc' });
  };
  const resetSortCompleted = () => {
    setSortConfigCompleted({ key: 'pos_id', direction: 'asc' });
  };
  const updateTaskStatus = async (taskToUpdate) => {
    try {
      // Tentukan status baru
      const newStatus = taskToUpdate.status === 'Completed' ? 'Incomplete' : 'Completed';
  
      // Panggil API untuk memperbarui status di backend
      const response = await fetch('/api/update_task_status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskToUpdate.id, status: newStatus }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update task status');
      }
  
      // Perbarui state allTasks dan filteredTasks
      const updatedTasks = allTasks.map(task =>
        task.id === taskToUpdate.id ? { ...task, status: newStatus } : task
      );
      setAllTasks(updatedTasks);
  
    } catch (error) {
      console.error('Error updating task status:', error.message);
      alert('Failed to update task status. Please try again.');
    }
  };

  // Filter dan urutkan tugas yang belum selesai
  const filteredIncompleteTasks = allTasks
    .filter(task => task.status !== 'Completed')
    .filter(task =>
      task.title.toLowerCase().includes(incompleteSearchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(incompleteSearchTerm.toLowerCase())
    )
    .filter(task =>
      incompleteCategoryFilter === 'All' || task.category === incompleteCategoryFilter
    )
    .sort((a, b) => {
      const { key, direction } = sortConfigIncomplete;
      // bandingkan a[key] dan b[key]
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });


    // Filter dan urutkan tugas yang sudah selesai
    const filteredCompletedTasks = allTasks
    .filter(task => task.status === 'Completed')
    .filter(task =>
      task.title.toLowerCase().includes(completedSearchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(completedSearchTerm.toLowerCase())
    )
    .filter(task =>
      completedCategoryFilter === 'All' || task.category === completedCategoryFilter
    )
    .sort((a, b) => {
      const { key, direction } = sortConfigCompleted; // Ambil key dan direction dari sortConfigCompleted
      // Bandingkan a[key] dan b[key]
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    // Pagination untuk Incomplete Tasks
    const pagesVisitedIncomplete = (pageNumberIncomplete - 1) * tasksPerPageIncomplete;
    const displayIncompleteTasks = filteredIncompleteTasks.slice(
      pagesVisitedIncomplete,
      pagesVisitedIncomplete + tasksPerPageIncomplete
    );
    const pageCountIncomplete = Math.ceil(filteredIncompleteTasks.length / tasksPerPageIncomplete);

    // Pagination untuk Completed Tasks
    const pagesVisitedCompleted = (pageNumberCompleted - 1) * tasksPerPageCompleted;
    const displayCompletedTasks = filteredCompletedTasks.slice(
      pagesVisitedCompleted,
      pagesVisitedCompleted + tasksPerPageCompleted
    );
    const pageCountCompleted = Math.ceil(filteredCompletedTasks.length / tasksPerPageCompleted);

    const changePageIncomplete = (event, value) => {
      setPageNumberIncomplete(value);
    };

    const changePageCompleted = (event, value) => {
      setPageNumberCompleted(value);
    };

    // Fungsi untuk pengurutan
    const requestSortIncomplete = (key) => {
      let direction = 'asc';
      if (sortConfigIncomplete.key === key && sortConfigIncomplete.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfigIncomplete({ key, direction });
    };

    const requestSortCompleted = (key) => {
      let direction = 'asc';
      if (sortConfigCompleted.key === key && sortConfigCompleted.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfigCompleted({ key, direction });
    };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };
  const moveTask = async (dragTaskId, hoverTaskId) => {
  
    // Cari task yang di-drag dan di-hover berdasarkan ID
    const dragTask = filteredTasks.find(t => t.id === dragTaskId);
    const hoverTask = filteredTasks.find(t => t.id === hoverTaskId);
  
    if (!dragTask || !hoverTask) {
      console.error('Drag or hover task not found.');
      return;
    }
  
    // Tukar pos_id antara dragTask dan hoverTask
    const tempPosId = dragTask.pos_id;
    dragTask.pos_id = hoverTask.pos_id;
    hoverTask.pos_id = tempPosId;
  
    // Sort filteredTasks berdasarkan pos_id
    const updatedFilteredTasks = [...filteredTasks].sort((a, b) => a.pos_id - b.pos_id);
  
    setFilteredTasks(updatedFilteredTasks);
  
    // Sync perubahan ke allTasks
    const updatedAllTasks = [...allTasks].map(task => {
      const updatedTask = updatedFilteredTasks.find(t => t.id === task.id);
      return updatedTask ? { ...task, pos_id: updatedTask.pos_id } : task;
    });
  
    setAllTasks(updatedAllTasks);
  
    // Panggil API untuk memperbarui pos_id di database
    try {
      const response = await fetch('/api/dynamic_pos_id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dragTaskId, hoverTaskId }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update pos_id in database');
      }
  
    } catch (error) {
      console.error('Error updating pos_id in database:', error.message);
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" color="primary.main" gutterBottom>
          Tasks
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          {/* Bagian kiri: Add Task, Upload Excel/CSV, Selected File, dan Get Template */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenAddTaskDialog(true)}
              sx={{ mr: 2 }}
            >
              Add Task
            </Button>

            <Button
              variant="outlined"
              component="label"
              color="secondary"
              sx={{ mr: 2 }}
            >
              Upload Excel/CSV
              <input
                type="file"
                accept=".xlsx,.csv"
                hidden
                onChange={handleFileChange} // Simpan file yang dipilih
              />
            </Button>

            {/* Tombol Get Template */}
            <IconButton
              color="secondary"
              onClick={() => window.open('/Template Upload Todo List.xlsx', '_blank')} // Unduh file template
              sx={{ mr: 2 }}
            >
              <FileDownloadOutlined />
            </IconButton>

            {selectedFile && (
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Selected File: {selectedFile.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload} // Proses file saat tombol di-klik
                >
                  Upload
                </Button>
              </Box>
            )}
          </Box>

          {/* Bagian kanan: Export to Excel */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#139c50', // Warna hijau ala Excel
              color: 'white', // Warna teks
              '&:hover': {
                backgroundColor: '#145A32', // Warna hijau lebih gelap saat hover
              },
            }}
            startIcon={<FileDownload />} // Tambahkan ikon
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
        </Box>
        <AddTask
          open={openAddTaskDialog}
          onClose={() => setOpenAddTaskDialog(false)}
          onAdd={handleAddTask}
        />
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }} color="error.main">
          Incomplete/Ongoing Tasks
        </Typography>
        <TaskFilters
          showIncompleteFilters={true}
          showCompletedFilters={false} 
          incompleteSearchTerm={incompleteSearchTerm}
          setIncompleteSearchTerm={setIncompleteSearchTerm}
          incompleteCategoryFilter={incompleteCategoryFilter}
          setIncompleteCategoryFilter={setIncompleteCategoryFilter}
          sortConfig={sortConfigIncomplete}
          requestSort={requestSortIncomplete}
          tasksPerPage={tasksPerPageIncomplete}
          setTasksPerPage={setTasksPerPageIncomplete}
          onResetSort={resetSortIncomplete}
        />
        <IncompletedTask
          tasks={displayIncompleteTasks}
          handleStatusChange={updateTaskStatus}
          handleRowClick={handleRowClick}
          moveTask={moveTask}
          handleDelete={confirmDeleteTask} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            Page {pageNumberIncomplete} of {pageCountIncomplete}
          </Typography>
          <Pagination
            count={pageCountIncomplete}
            page={pageNumberIncomplete}
            onChange={changePageIncomplete}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  },
                }}
              />
            )}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }} color="success.main">
          Completed Tasks
        </Typography>
        <TaskFilters
          showIncompleteFilters={false}
          showCompletedFilters={true} 
          completedSearchTerm={completedSearchTerm}
          setCompletedSearchTerm={setCompletedSearchTerm}
          completedCategoryFilter={completedCategoryFilter}
          setCompletedCategoryFilter={setCompletedCategoryFilter}
          sortConfig={sortConfigCompleted}
          requestSort={requestSortCompleted}
          tasksPerPage={tasksPerPageCompleted}
          setTasksPerPage={setTasksPerPageCompleted}
          onResetSort={resetSortCompleted}
        />
        <CompletedTask
          tasks={displayCompletedTasks}
          handleStatusChange={updateTaskStatus}
          handleRowClick={handleRowClick}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            Page {pageNumberCompleted} of {pageCountCompleted}
          </Typography>
          <Pagination
            count={pageCountCompleted}
            page={pageNumberCompleted}
            onChange={changePageCompleted}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  },
                }}
              />
            )}
          />
        </Box>

        <TaskDetails 
          open={openDialog} 
          task={selectedTask} 
          onClose={handleCloseDialog} 
          onSave={handleSave}
        />

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Mark task as incomplete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to mark "{taskToUpdate?.title}" as incomplete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => updateTaskStatus(taskToUpdate)} 
              autoFocus
              color="primary"
            >
              Yes, Mark Incomplete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">{"Delete Task?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
          <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ width: '50%' }} // Tambahkan lebar untuk membuat Snackbar lebih besar
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', fontSize: '1.2rem', padding: '16px' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
}
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button
} from '@mui/material';
import api from './api';

const columns = [
    { id: 'manufacture_number', label: 'Manufacture Number', minWidth: 150 },
    { id: 'schedule_interval', label: 'Schedule Interval', minWidth: 150 },
    { id: 'last_ping', label: 'Last Ping', minWidth: 160 },
    { id: 'kind', label: 'Kind', minWidth: 150 },
    { id: 'task', label: 'Task', minWidth: 150 },
];

const MainPage = () => {
    const [instances, setInstances] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchInstances = async () => {
        try {
            const response = await api.get('/instances/');
            console.log('API Response:', response.data);
            setInstances(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchInstances();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const renderSoftwareCell = (sw) => {
        if (sw) {
            return (
                <div>
                    <strong>Version:</strong> {sw.version}<br />
                    <strong>Commit Hash:</strong> {sw.commit_hash}<br />
                    <strong>Path:</strong> {sw.path}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            {/* Панель зверху */}
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        ROBOSUPPORT
                    </Typography>
                    <Button color="inherit">пошук</Button>
                </Toolbar>
            </AppBar>

            {/* Контейнер для основного контенту */}
            <Container sx={{ marginTop: 3 }}>
                <Paper  
                    elevation={3} 
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto', 
                }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            align="center"
                                            key={column.id}
                                            style={{ 
                                                minWidth: column.minWidth, 
                                                fontWeight: 'bold', 
                                                border: '1px solid #ccc' }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell 
                                        align="center" 
                                        style={{ minWidth: 170, fontWeight: 'bold', border: '1px solid #ccc' }}>
                                            Software
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {instances
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((instance) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={instance.manufacture_number}
                                        >
                                            {columns.map((column) => {
                                                const value = instance[column.id];

                                                const renderValue = (value) => {
                                                    if (value && typeof value === 'object') {
                                                        return value?.name || ''; 
                                                    }
                                                    return value;
                                                };

                                                return (
                                                    <TableCell 
                                                        key={column.id}
                                                        style={{ 
                                                            border: '1px solid #ccc'
                                                        }}>
                                                        {renderValue(value)}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell 
                                                style={{ 
                                                    border: '1px solid #ccc'
                                                }}>
                                                {renderSoftwareCell(instance.sw)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={instances.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </div>
    );
};

export default MainPage;
=======
import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import api from './api';

const columns = [
    { id: 'manufacture_number', label: 'Manufacture Number', minWidth: 150 },
    { id: 'schedule_interval', label: 'Schedule Interval', minWidth: 130 },
    { id: 'last_ping', label: 'Last Ping', minWidth: 160 },
    { id: 'kind', label: 'Kind', minWidth: 150 },
    { id: 'task', label: 'Task', minWidth: 150 },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const MainPage = () => {
    const [instances, setInstances] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedInstance, setSelectedInstance] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [kinds, setKinds] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [softwareOptions, setSoftwareOptions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newInstance, setNewInstance] = useState({
        manufacture_number: '',
        schedule_interval: '',
        last_ping: '',
        username: '',
        pwd_salt: '',
        kind: '',
        task: '',
        sw: '',
    });
    
    const fetchInstances = async () => {
        try {
            const response = await api.get('/instances/');
            console.log('API Response:', response.data);
            setInstances(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [kindsResponse, tasksResponse, softwareResponse] = await Promise.all([
                api.get('/kinds/'),
                api.get('/tasks/'),
                api.get('/software/')
            ]);

            setKinds(kindsResponse.data);
            setTasks(tasksResponse.data);
            setSoftwareOptions(softwareResponse.data);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    useEffect(() => {
        fetchInstances();
        fetchDropdownData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEditClick = (instance) => {
        setSelectedInstance({ ...instance });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedInstance(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'kind' || name === 'task') {
            setSelectedInstance((prev) => ({
                ...prev,
                [name]: { id: value },  
            }));
        } else if (name === 'sw') {
            setSelectedInstance((prev) => ({
                ...prev,
                [name]: { id: value },  
            }));
        } else {
            setSelectedInstance((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    

    const handleSaveChanges = async () => {
        try {
            console.log("Data to send:", selectedInstance); 
            const requestData = {
                manufacture_number: selectedInstance.manufacture_number,
                schedule_interval: selectedInstance.schedule_interval,
                last_ping: selectedInstance.last_ping,
                kind_id: selectedInstance.kind?.id || null,
                task_id: selectedInstance.task?.id || null,
                sw_id: selectedInstance.sw?.id || null,
            };
    
            console.log("Formatted data:", requestData); 
            await api.put(`/instances/${selectedInstance.id}/`, requestData);
    
            setInstances((prevInstances) =>
                prevInstances.map((instance) =>
                    instance.id === selectedInstance.id
                        ? { ...instance, ...selectedInstance } 
                        : instance
                )
            );
            handleModalClose();
        } catch (error) {
            console.error('Error updating instance:', error);
        }
    };
    

    const renderSoftwareCell = (sw) => {
        if (sw) {
            return (
                <div>
                    <strong>Version:</strong> {sw.version}<br />
                    <strong>Commit Hash:</strong> {sw.commit_hash}<br />
                    <strong>Path:</strong> {sw.path}
                </div>
            );
        }
        return null;
    };

    const handleAddClick = () => {
        setIsAddModalOpen(true);
        setNewInstance({
            manufacture_number: '',
            schedule_interval: '',
            last_ping: '',
            username: '',
            pwd_salt: '',
            kind: '',
            task: '',
            sw: '',
        });
    };
    
    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleNewInstanceChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'kind' || name === 'task' || name === 'sw') {
            const parsedValue = parseInt(value, 10);
            setNewInstance((prev) => ({
                ...prev,
                [name]: parsedValue === 0 ? 0 : kinds.find((kind) => kind.id === parsedValue) ||
                                                         tasks.find((task) => task.id === parsedValue) || 
                                                         softwareOptions.find((sw) => sw.id === parsedValue) ||
                                                         { id: parsedValue }, 
            }));
        } else {
            setNewInstance((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    
   
    const handleAddInstance = async () => {
        try {
            const requestData = {
                manufacture_number: parseInt(newInstance.manufacture_number) || 0, 
                schedule_interval: parseInt(newInstance.schedule_interval) || 300, 
                last_ping: newInstance.last_ping, 
                username: newInstance.username || '',
                pwd_salt: newInstance.pwd_salt || '',
                kind_id: newInstance.kind !== undefined ? newInstance.kind.id : null, 
                task_id: newInstance.task !== undefined ? newInstance.task.id : null,
                sw_id: newInstance.sw !== undefined ? newInstance.sw.id : null, 
            };
        
            const response = await api.post('/instances/', requestData);
            setInstances((prevInstances) => [...prevInstances, response.data]);
            handleAddModalClose();
        } catch (error) {
            console.error('Error adding instance:', error.response?.data?.detail || error.message);
        }
    };
    
    return (
        <div>
            {/* Панель зверху */}
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        ROBOSUPPORT
                    </Typography>
                    <Button color="inherit" onClick={handleAddClick}>
                        Додати
                    </Button>

                </Toolbar>
            </AppBar>

            {/* Контейнер для основного контенту */}
            <Container sx={{ marginTop: 3 }}>
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto',
                    }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            align="center"
                                            key={column.id}
                                            style={{
                                                minWidth: column.minWidth,
                                                fontWeight: 'bold',
                                                border: '1px solid #ccc',
                                            }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell 
                                        align="center" 
                                        style={{ minWidth: 170, fontWeight: 'bold', border: '1px solid #ccc' }}>
                                        Software
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        style={{ minWidth: 150, fontWeight: 'bold', border: '1px solid #ccc' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {instances
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((instance) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={instance.manufacture_number}>
                                            {columns.map((column) => {
                                                const value = instance[column.id];

                                                const renderValue = (value) => {
                                                    if (value && typeof value === 'object') {
                                                        return value?.name || ''; 
                                                    }
                                                    return value;
                                                };

                                                return (
                                                    <TableCell 
                                                        key={column.id}
                                                        style={{ 
                                                            border: '1px solid #ccc'
                                                        }}>
                                                        {renderValue(value)}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell 
                                                style={{ 
                                                    border: '1px solid #ccc'
                                                }}>
                                                {renderSoftwareCell(instance.sw)}
                                            </TableCell>
                                            <TableCell style={{ border: '1px solid #ccc' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleEditClick(instance)}>
                                                    Редагувати
                                                </Button>
                                              
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={instances.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>

            <Modal open={isModalOpen} onClose={handleModalClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Редагування запису
                    </Typography>
                    {selectedInstance && (
                        <>
                            {columns.map((column) => (
                                column.id !== 'kind' && column.id !== 'task' && (
                                    <TextField
                                        key={column.id}
                                        name={column.id}
                                        label={column.label}
                                        value={selectedInstance[column.id] || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                )
                            ))}

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Kind</InputLabel>
                                <Select
                                    name="kind"
                                    value={selectedInstance?.kind?.id ?? ''}  
                                    onChange={handleInputChange}
                                    label="Kind"
                                >
                                    {kinds.length > 0 ? (
                                        kinds.map((kind) => (
                                            <MenuItem key={kind.id} value={kind.id}>
                                                {kind.name} 
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Немає доступних варіантів</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Task</InputLabel>
                                <Select
                                    name="task"
                                    value={selectedInstance?.task?.id ?? ''} 
                                    onChange={handleInputChange}
                                    label="Task"
                                >
                                    {tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <MenuItem key={task.id} value={task.id}>
                                                {task.name} 
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Немає доступних варіантів</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Software</InputLabel>
                                <Select
                                    name="sw"
                                    value={selectedInstance?.sw?.id ?? ''}  
                                    onChange={handleInputChange}
                                    label="Software"
                                >
                                    {softwareOptions.length > 0 ? (
                                        softwareOptions.map((sw) => (
                                            <MenuItem key={sw.id} value={sw.id}>  
                                                {sw.version}  
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Немає доступних варіантів</MenuItem>
                                    )}
                                </Select>
                            </FormControl>



                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                <Button variant="outlined" onClick={handleModalClose}>Закрити</Button>
                                <Button variant="contained" onClick={handleSaveChanges}>Зберегти зміни</Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal open={isAddModalOpen} onClose={handleAddModalClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Додати запис
                    </Typography>
                    <TextField
                        name="manufacture_number"
                        label="Manufacture Number"
                        value={newInstance.manufacture_number}
                        onChange={handleNewInstanceChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="schedule_interval"
                        label="Schedule Interval"
                        value={newInstance.schedule_interval}
                        onChange={handleNewInstanceChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="last_ping"
                        label="Last Ping"
                        value={newInstance.last_ping}
                        onChange={handleNewInstanceChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="username"
                        label="Username"
                        value={newInstance.username}
                        onChange={handleNewInstanceChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="pwd_salt"
                        label="Password Salt"
                        value={newInstance.pwd_salt}
                        onChange={handleNewInstanceChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Kind</InputLabel>
                        <Select
                            name="kind"
                            value={newInstance?.kind?.id ?? ''}
                            onChange={handleNewInstanceChange}
                            label="Kind"
                        >
                            {kinds.map((kind) => (
                                <MenuItem key={kind.id} value={kind.id}>
                                    {kind.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Task</InputLabel>
                        <Select
                            name="task"
                            value={newInstance?.task?.id ?? ''}
                            onChange={handleNewInstanceChange}
                            label="Task"
                        >
                            {tasks.map((task) => (
                                <MenuItem key={task.id} value={task.id}>
                                    {task.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Software</InputLabel>
                        <Select
                            name="sw"
                            value={newInstance?.sw?.id ?? ''}
                            onChange={handleNewInstanceChange}
                            label="Software"
                        >
                            {softwareOptions.map((sw) => (
                                <MenuItem key={sw.id} value={sw.id}>
                                    {sw.version}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button variant="outlined" onClick={handleAddModalClose}>
                            Закрити
                        </Button>
                        <Button variant="contained" onClick={handleAddInstance}>
                            Зберегти
                        </Button>
                    </Box>
                </Box>
            </Modal>


        </div>
    );
};
export default MainPage;
>>>>>>> master

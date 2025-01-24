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

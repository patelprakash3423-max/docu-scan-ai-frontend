import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  Visibility,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { documentsAPI } from '../services/api.js';

// ... rest of the DocumentList component code remains the same

const DocumentList = ({ refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchDocuments = async (page = 0, search = '') => {
    setLoading(true);
    try {
      const response = await documentsAPI.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search
      });
      
      const { documents: docs, pagination } = response.data;
      setDocuments(docs);
      setTotalCount(pagination.total);
    } catch (error) {
      enqueueSnackbar('Error fetching documents', { variant: 'error' });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(page, searchQuery);
  }, [page, rowsPerPage, refreshTrigger, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (documentId, documentTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${documentTitle}"?`)) {
      return;
    }

    try {
      await documentsAPI.delete(documentId);
      enqueueSnackbar('Document deleted successfully', { variant: 'success' });
      fetchDocuments(page, searchQuery);
    } catch (error) {
      enqueueSnackbar('Error deleting document', { variant: 'error' });
    }
  };

  const handleViewDocument = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      processing: 'warning',
      completed: 'success',
      failed: 'error'
    };
    return colors[status] || 'default';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search documents by title or content..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton 
          onClick={() => fetchDocuments(page, searchQuery)}
          disabled={loading}
          color="primary"
        >
          <Refresh />
        </IconButton>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>OCR Status</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading documents...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Alert severity="info">
                    {searchQuery ? 'No documents found matching your search.' : 'No documents uploaded yet.'}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow 
                  key={document._id} 
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {document.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {document.originalName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={document.fileType.split('/')[1]?.toUpperCase() || 'FILE'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatFileSize(document.fileSize)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={document.ocrStatus} 
                      color={getStatusColor(document.ocrStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(document.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => handleViewDocument(document._id)}
                      color="primary"
                      size="small"
                      title="View Document"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(document._id, document.title)}
                      color="error"
                      size="small"
                      title="Delete Document"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Paper>
  );
};

export default DocumentList;
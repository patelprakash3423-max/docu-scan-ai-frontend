import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Description,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { documentsAPI } from '../services/api.js';

// ... rest of the DocumentView component code remains the same

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getById(id);
      setDocument(response.data.document);
    } catch (error) {
      setError('Error fetching document');
      enqueueSnackbar('Error fetching document', { variant: 'error' });
    } finally {
      setLoading(false);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !document) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Document not found'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
          {document.title}
        </Typography>
        <Button
          startIcon={<Download />}
          variant="contained"
          onClick={() => window.open(document.fileUrl, '_blank')}  // ✅ Updated line
        >
          Download
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Document Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Document Information
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Description color="primary" />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {document.originalName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Original filename
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    File Type:
                  </Typography>
                  <Chip
                    label={document.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    File Size:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatFileSize(document.fileSize)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    OCR Status:
                  </Typography>
                  <Chip
                    label={document.ocrStatus}
                    color={getStatusColor(document.ocrStatus)}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(document.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Extracted Text */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Extracted Text
              </Typography>

              {document.ocrStatus === 'processing' ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    OCR processing in progress...
                  </Typography>
                </Box>
              ) : document.ocrStatus === 'failed' ? (
                <Alert severity="error">
                  OCR processing failed. Please try uploading the document again.
                </Alert>
              ) : document.extractedText ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      lineHeight: 1.6
                    }}
                  >
                    {document.extractedText}
                  </Typography>
                </Paper>
              ) : (
                <Alert severity="info">
                  No text extracted from this document.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentView;
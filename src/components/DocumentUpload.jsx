import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Close,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { documentsAPI } from '../services/api.js';

// ... rest of the DocumentUpload component code remains the same

const DocumentUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const validFiles = selectedFiles.filter(file => {
      const isValidType = [
        'image/jpeg',
        'image/png', 
        'image/jpg',
        'application/pdf'
      ].includes(file.type);
      
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      return isValidType && isValidSize;
    });

    setFiles(validFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, "")); // Remove extension

      try {
        const response = await documentsAPI.upload(formData);
        
        // Simulate progress for better UX
        for (let i = 0; i <= 100; i += 20) {
          setProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return { success: true, data: response.data, file };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Upload failed',
          file 
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (successfulUploads.length > 0) {
        enqueueSnackbar(
          `Successfully uploaded ${successfulUploads.length} file(s)`,
          { variant: 'success' }
        );
        onUploadSuccess?.();
      }

      if (failedUploads.length > 0) {
        failedUploads.forEach(({ error, file }) => {
          enqueueSnackbar(
            `Failed to upload ${file.name}: ${error}`,
            { variant: 'error' }
          );
        });
      }

      setFiles([]);
    } catch (error) {
      enqueueSnackbar('Upload failed', { variant: 'error' });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Documents
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <input
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: 'none' }}
          id="document-upload"
          multiple
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor="document-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            disabled={uploading}
            sx={{ mr: 2 }}
          >
            Select Files
          </Button>
        </label>
        
        <Button
          variant="contained"
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
          startIcon={uploading ? null : <CloudUpload />}
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
        </Button>
      </Box>

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" align="center">
            Uploading... {progress}%
          </Typography>
        </Box>
      )}

      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                }
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemIcon>
                  <InsertDriveFile color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                      <Chip 
                        label={file.type.split('/')[1]?.toUpperCase() || 'FILE'} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={formatFileSize(file.size)}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        Supported formats: JPG, PNG, PDF (Max 10MB per file)
      </Alert>
    </Paper>
  );
};

export default DocumentUpload;
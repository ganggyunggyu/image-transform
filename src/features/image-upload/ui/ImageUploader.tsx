import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon, DeleteSweep as DeleteSweepIcon } from '@mui/icons-material';
import type { ImageFile } from '@/shared/types';
import { cn } from '@/shared/lib';

interface Props {
  imageFiles: ImageFile[];
  onFilesAdd: (files: ImageFile[]) => void;
  onClearFiles: () => void;
  isDragActive: boolean;
}

export const ImageUploader: React.FC<Props> = ({
  imageFiles,
  onFilesAdd,
  onClearFiles,
  isDragActive
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        name: file.name,
        preview: URL.createObjectURL(file),
        size: file.size,
      }));

    onFilesAdd(newFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.gif', '.tiff'] },
  });

  return (
    <Box className={cn('space-y-4')}>
      <Paper
        {...getRootProps()}
        elevation={0}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer min-h-[140px]',
          'flex flex-col items-center justify-center transition-all duration-300 ease-in-out',
          isDragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-lg'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 hover:shadow-md'
        )}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon 
          sx={{ 
            fontSize: 48, 
            color: isDragActive ? '#3b82f6' : '#9ca3af',
            mb: 2,
            transition: 'color 0.3s ease'
          }} 
        />
        <Typography 
          variant="body1" 
          className={cn('font-semibold mb-1')}
          sx={{ 
            color: isDragActive ? '#3b82f6' : '#374151',
            transition: 'color 0.3s ease'
          }}
        >
          {isDragActive ? '파일을 여기에 놓으세요' : '이미지를 업로드하세요'}
        </Typography>
        <Typography variant="body2" className={cn('text-gray-500')}>
          드래그 앤 드롭하거나 클릭하여 파일을 선택하세요
        </Typography>
      </Paper>

      <Button
        onClick={onClearFiles}
        disabled={imageFiles.length === 0}
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<DeleteSweepIcon />}
        className={cn('py-3 text-sm font-semibold rounded-xl border-2')}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderWidth: '2px'
          }
        }}
      >
        전체 삭제
      </Button>
    </Box>
  );
};

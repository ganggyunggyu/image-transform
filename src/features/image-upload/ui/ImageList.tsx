import React from 'react';
import { Box, Typography, Chip, List, ListItem, ListItemText, ListItemIcon, Avatar } from '@mui/material';
import { Image as ImageIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { ImageFile } from '../../../shared/types';
import { formatFileSize } from '../../../shared/utils';

interface Props {
  imageFiles: ImageFile[];
  selectedImage: ImageFile | null;
  onImageSelect: (image: ImageFile) => void;
}

export const ImageList: React.FC<Props> = ({
  imageFiles,
  selectedImage,
  onImageSelect
}) => {
  return (
    <Box className="flex flex-col h-full">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="subtitle2" className="font-bold text-gray-800">
          파일 목록
        </Typography>
        <Chip 
          label={`${imageFiles.length}개`} 
          size="small" 
          className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-semibold"
        />
      </Box>
      
      <Box className="flex-1 overflow-y-auto min-h-0">
        {imageFiles.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
            <Typography variant="body2" className="text-gray-500 font-medium">
              파일이 없습니다
            </Typography>
          </Box>
        ) : (
          <List className="p-0">
            {imageFiles.map((img) => (
              <ListItem
                key={img.id}
                onClick={() => onImageSelect(img)}
                className={`
                  group mb-2 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out
                  ${selectedImage?.id === img.id 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md border-2 border-blue-200' 
                    : 'bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:shadow-md border-2 border-transparent hover:border-gray-200'
                  }
                `}
                sx={{
                  borderRadius: '16px',
                  '&:hover': {
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <ListItemIcon className="min-w-0 mr-3">
                  <Avatar 
                    className="w-10 h-10"
                    sx={{
                      background: selectedImage?.id === img.id 
                        ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
                        : 'linear-gradient(45deg, #10b981, #059669)',
                      width: 40,
                      height: 40
                    }}
                  >
                    {selectedImage?.id === img.id ? (
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                    ) : (
                      <ImageIcon sx={{ color: 'white', fontSize: 20 }} />
                    )}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      className="font-semibold text-gray-900 truncate"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {img.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="text-gray-500 font-medium">
                      {formatFileSize(img.size)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useAtom } from 'jotai';
import { Image as ImageIcon } from '@mui/icons-material';
import {
  imageFilesAtom,
  selectedImageAtom,
  addImageFilesAtom,
  clearAllImagesAtom,
  showAlertMessageAtom,
  selectImageAtom,
} from '../../../shared/stores/atoms';
import { ImageUploader, ImageList } from '../../../features/image-upload';
import type { ImageFile } from '../../../shared/types';

export const ImageUploadSection: React.FC = () => {
  const [imageFiles] = useAtom(imageFilesAtom);
  const [selectedImage] = useAtom(selectedImageAtom);
  const [, addImageFiles] = useAtom(addImageFilesAtom);
  const [, clearAllImages] = useAtom(clearAllImagesAtom);
  const [, showAlertMessage] = useAtom(showAlertMessageAtom);
  const [, selectImage] = useAtom(selectImageAtom);

  const handleFilesAdd = (newFiles: ImageFile[]) => {
    addImageFiles(newFiles);
    showAlertMessage(`${newFiles.length}개의 이미지가 추가되었습니다.`, 'success');
  };

  const handleClearFiles = () => {
    clearAllImages();
    showAlertMessage('모든 이미지가 삭제되었습니다.', 'info');
  };

  const handleImageSelect = (imageFile: ImageFile) => {
    selectImage(imageFile);
  };

  const { isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const imageFiles = acceptedFiles
        .filter(file => file.type.startsWith('image/'))
        .map(file => ({
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          preview: URL.createObjectURL(file),
          size: file.size,
        }));
      
      if (imageFiles.length > 0) {
        handleFilesAdd(imageFiles);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
    noClick: true,
  });

  return (
    <div className="w-80 bg-white shadow-lg border-r flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon />
          이미지 관리
        </h2>
      </div>
      <div className="flex-1 p-6">
        <ImageUploader
          imageFiles={imageFiles}
          onFilesAdd={handleFilesAdd}
          onClearFiles={handleClearFiles}
          isDragActive={isDragActive}
        />
        <ImageList
          imageFiles={imageFiles}
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
};
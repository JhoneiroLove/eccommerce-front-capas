/**
 * Convert File to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/type;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        };
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'Image file size must be less than 2MB'
        };
    }

    return { isValid: true };
};

/**
 * Convert Base64 to data URL for display
 */
export const base64ToDataUrl = (base64: string, contentType: string = 'image/jpeg'): string => {
    return `data:${contentType};base64,${base64}`;
};

/**
 * Resize image to maximum dimensions while maintaining aspect ratio
 */
export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to base64
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const result = reader.result as string;
                            const base64 = result.split(',')[1];
                            resolve(base64);
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        reject(new Error('Failed to resize image'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // Create object URL for the image
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Get image content type from file
 */
export const getImageContentType = (file: File): string => {
    return file.type || 'image/jpeg';
};

/**
 * Generate thumbnail from image file
 */
export const generateThumbnail = (file: File, size: number = 150): Promise<string> => {
    return resizeImage(file, size, size, 0.7);
};
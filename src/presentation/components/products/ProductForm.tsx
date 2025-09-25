import React, { useState, useRef } from 'react';
import { useProductStore } from '../../../business/stores/productStore';
import { useAuthStore } from '../../../business/stores/authStore';
import { fileToBase64, validateImageFile, getImageContentType, base64ToDataUrl } from '../../../shared/utils/imageUtils';
import type { ProductResponse, ProductCreateRequest, ProductUpdateRequest } from '../../../data/api/springApiClient';

interface ProductFormProps {
    product?: ProductResponse;
    onSuccess?: (product: ProductResponse) => void;
    onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
    const { createProduct, updateProduct, isLoading } = useProductStore();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        stock: product?.stock?.toString() || '',
        active: product?.active !== undefined ? product.active : true,
    });

    const [imageData, setImageData] = useState<{
        base64: string;
        contentType: string;
        preview: string;
    } | null>(
        product?.imageData ? {
            base64: product.imageData,
            contentType: product.imageContentType || 'image/jpeg',
            preview: product.imageDataUrl || base64ToDataUrl(product.imageData, product.imageContentType)
        } : null
    );

    const [imageError, setImageError] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageError('');

        // Validate image
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setImageError(validation.error || 'Invalid image file');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            const contentType = getImageContentType(file);
            const preview = base64ToDataUrl(base64, contentType);

            setImageData({
                base64,
                contentType,
                preview
            });
        } catch (error) {
            setImageError('Failed to process image file');
        }
    };

    const removeImage = () => {
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!user) {
            setFormError('User not authenticated');
            return;
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            ...(imageData && {
                imageData: imageData.base64,
                imageContentType: imageData.contentType
            }),
            ...(product ? {} : { sellerId: user.id }) // Only for create
        };

        try {
            let result: ProductResponse;

            if (product) {
                // Update existing product
                const updateData: ProductUpdateRequest = {
                    ...productData,
                    active: formData.active,
                    // If no image data and we want to remove existing image
                    ...(imageData === null && product.imageData ? {
                        imageData: '',
                        imageContentType: undefined
                    } : {})
                };
                result = await updateProduct(product.id, updateData);
            } else {
                // Create new product
                result = await createProduct(productData as ProductCreateRequest);
            }

            onSuccess?.(result);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to save product';
            setFormError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{formError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                        maxLength={100}
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                    />
                </div>

                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                        min="0"
                        max="999999"
                    />
                </div>

                {product && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                            Product is active
                        </label>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                    required
                    maxLength={500}
                />
            </div>

            {/* Image Upload Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                </label>

                {imageData ? (
                    <div className="space-y-3">
                        <div className="relative inline-block">
                            <img
                                src={imageData.preview}
                                alt="Product preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Click the × to remove image</p>
                    </div>
                ) : (
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        {imageError && (
                            <p className="mt-1 text-sm text-red-600">{imageError}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF, WebP up to 2MB. Image will be automatically resized.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
import api from '../api/axios';
import type { Category, CategoryForm } from '../types';

export async function getCategories() {
    const { data } = await api.get<{ total: number; categories: Category[] }>('/categories');
    return data.categories;
}

export async function getActiveCategories() {
    const { data } = await api.get<{ total: number; categories: Category[] }>('/categories/active');
    return data.categories;
}

export async function createCategory(formData: CategoryForm) {
    const { data } = await api.post('/categories', formData);
    return data;
}

export async function updateCategory(id: number, formData: CategoryForm) {
    const { data } = await api.patch(`/categories/${id}`, formData);
    return data;
}

export async function toggleCategoryActive(id: number) {
    const { data } = await api.patch(`/categories/${id}/toggle-active`);
    return data;
}

export async function deleteCategory(id: number) {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
}
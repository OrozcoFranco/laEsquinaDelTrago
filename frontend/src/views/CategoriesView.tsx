import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
    getCategories,
    createCategory,
    updateCategory,
    toggleCategoryActive,
    deleteCategory,
} from "../service/categories";
import type { Category, CategoryForm } from "../types";
import RoleGuard from "../components/RoleGuard";
import ErrorMessage from "../components/ErrorMessage";

export default function CategoriesView() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
        defaultValues: { name: '' },
    });

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error("No se pudieron cargar las categorías");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSave = async (formData: CategoryForm) => {
        try {
            if (editingId) {
                const data = await updateCategory(editingId, formData);
                toast.success(data.message);
            } else {
                const data = await createCategory(formData);
                toast.success(data.message);
            }
            reset();
            setEditingId(null);
            loadCategories();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id_category);
        reset({ name: category.name });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset({ name: '' });
    };

    const handleToggleActive = async (id: number) => {
        try {
            const data = await toggleCategoryActive(id);
            toast.success(data.message);
            loadCategories();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Seguro que querés eliminar esta categoría?")) return;

        try {
            const data = await deleteCategory(id);
            toast.success(data.message);
            loadCategories();
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    if (isLoading) return <p className="text-gray-500">Cargando categorías...</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>

            {/* Formulario crear/editar - solo OWNER y MANAGER */}
            <RoleGuard allowedRoles={['owner', 'manager']}>
                <form
                    onSubmit={handleSubmit(handleSave)}
                    className="bg-white p-6 rounded-lg shadow flex gap-4 items-start"
                >
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Nombre de la categoría"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            {...register('name', {
                                required: "El nombre es obligatorio",
                                maxLength: { value: 60, message: "Máximo 60 caracteres" },
                            })}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    <button
                        type="submit"
                        className="bg-fuchsia-950 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                        {editingId ? 'Guardar cambios' : 'Crear categoría'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-300 px-4 py-2 rounded-lg font-semibold"
                        >
                            Cancelar
                        </button>
                    )}
                </form>
            </RoleGuard>

            {/* Listado */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Estado</th>
                            <RoleGuard allowedRoles={['owner', 'manager']}>
                                <th className="p-4">Acciones</th>
                            </RoleGuard>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id_category} className="border-t">
                                <td className="p-4">{category.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        category.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {category.isActive ? 'Activa' : 'Inactiva'}
                                    </span>
                                </td>
                                <RoleGuard allowedRoles={['owner', 'manager']}>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(category.id_category)}
                                            className="text-yellow-600 hover:underline"
                                        >
                                            {category.isActive ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <RoleGuard allowedRoles={['owner']}>
                                            <button
                                                onClick={() => handleDelete(category.id_category)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </RoleGuard>
                                    </td>
                                </RoleGuard>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <p className="text-center text-gray-400 p-8">No hay categorías cargadas</p>
                )}
            </div>
        </div>
    );
}
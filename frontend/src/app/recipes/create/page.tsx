'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import { ChefHat, Clock, Users, Image as ImageIcon } from 'lucide-react';

interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  imageUrl: string;
  difficulty: 'FÁCIL' | 'MEDIA' | 'DIFÍCIL';
}

export default function CreateRecipePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: 30,
    servings: 4,
    imageUrl: '',
    difficulty: 'MEDIA',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    field: 'ingredients' | 'instructions'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (index: number, field: 'ingredients' | 'instructions') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear una receta');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validar campos requeridos
      if (!formData.title || !formData.description) {
        throw new Error('El título y la descripción son obligatorios');
      }

      // Filtrar ingredientes e instrucciones vacías
      const filteredData = {
        ...formData,
        ingredients: formData.ingredients.filter(Boolean),
        instructions: formData.instructions.filter(Boolean),
      };

      const response = await api.post('/api/recipes', filteredData);
      router.push(`/recipes/${response.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la receta');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-secondary/20 bg-background p-8 text-center">
        <ChefHat className="h-12 w-12 text-secondary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Acceso restringido</h3>
        <p className="text-secondary mb-4">
          Debes iniciar sesión para crear una receta
        </p>
        <button
          onClick={() => router.push('/login')}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Crear Nueva Receta</h1>
        <p className="text-secondary">
          Comparte tu receta con la comunidad y ayuda a otros a descubrir nuevos sabores
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título de la Receta
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="Ej: Paella Valenciana"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="Describe brevemente tu receta..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cookingTime" className="block text-sm font-medium mb-2">
                Tiempo de Cocción (minutos)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="cookingTime"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 pl-10 focus:border-primary focus:outline-none"
                  min="1"
                  required
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              </div>
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium mb-2">
                Porciones
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 pl-10 focus:border-primary focus:outline-none"
                  min="1"
                  required
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
                Dificultad
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 focus:border-primary focus:outline-none"
                required
              >
                <option value="FÁCIL">Fácil</option>
                <option value="MEDIA">Media</option>
                <option value="DIFÍCIL">Difícil</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              URL de la Imagen
            </label>
            <div className="relative">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-secondary/20 bg-background px-4 py-2 pl-10 focus:border-primary focus:outline-none"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Ingredientes</label>
            <button
              type="button"
              onClick={() => addArrayItem('ingredients')}
              className="text-sm text-primary hover:text-primary-hover"
            >
              + Añadir Ingrediente
            </button>
          </div>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'ingredients')}
                className="flex-1 rounded-lg border border-secondary/20 bg-background px-4 py-2 focus:border-primary focus:outline-none"
                placeholder={`Ingrediente ${index + 1}`}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'ingredients')}
                  className="rounded-lg border border-error/20 bg-error/5 px-3 text-error hover:bg-error/10"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Instrucciones</label>
            <button
              type="button"
              onClick={() => addArrayItem('instructions')}
              className="text-sm text-primary hover:text-primary-hover"
            >
              + Añadir Paso
            </button>
          </div>
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={instruction}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'instructions')}
                className="flex-1 rounded-lg border border-secondary/20 bg-background px-4 py-2 focus:border-primary focus:outline-none"
                placeholder={`Paso ${index + 1}`}
                rows={2}
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'instructions')}
                  className="rounded-lg border border-error/20 bg-error/5 px-3 text-error hover:bg-error/10"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Receta'}
          </button>
        </div>
      </form>
    </div>
  );
} 
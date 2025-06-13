'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Clock, Users, Heart, ChefHat, ArrowLeft } from 'lucide-react';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookingTime: number;
  servings: number;
  difficulty: 'FÁCIL' | 'MEDIA' | 'DIFÍCIL';
  ingredients: string[];
  instructions: string[];
  likes: number;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const { token } = useAuthStore();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);
        if (!token) {
          setError('Debes iniciar sesión para ver las recetas');
          return;
        }

        const response = await api.get(`/api/recipes/${params.id}`);
        setRecipe(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching recipe:', err);
        if (err.response?.status === 404) {
          setError('Receta no encontrada');
        } else if (err.response?.status === 401) {
          setError('Debes iniciar sesión para ver las recetas');
        } else {
          setError('Error al cargar la receta');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params?.id, token]);

  const handleImageError = () => {
    setImgError(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-secondary/20 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary/20 rounded w-3/4" />
            <div className="h-4 bg-secondary/20 rounded w-1/2" />
            <div className="h-4 bg-secondary/20 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
          <p>{error || 'Receta no encontrada'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      {/* Recipe Header */}
      <div className="space-y-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          {recipe.imageUrl && !imgError ? (
            <Image
              src={recipe.imageUrl}
              alt={`Imagen de ${recipe.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-secondary/40" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{recipe.title}</h1>
              <p className="text-secondary mt-2">{recipe.description}</p>
            </div>
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
              aria-label={isFavorite(recipe.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite(recipe.id) ? 'fill-primary text-primary' : 'text-secondary'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookingTime} minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{recipe.servings} porciones</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <span>Dificultad: {recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Ingredients */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ingredientes</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Instrucciones</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Recipe Footer */}
      <div className="mt-8 pt-8 border-t border-secondary/20">
        <div className="flex items-center justify-between text-sm text-secondary">
          <div>
            <p>Creado por Brandon Echeverry</p>
            <p className="mt-1">
              {new Date(recipe.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span>{recipe.likes} me gusta</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
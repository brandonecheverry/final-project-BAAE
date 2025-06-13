'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import RecipeCard from '@/components/RecipeCard';
import { ChefHat, Plus } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookingTime: number;
  servings: number;
  likes?: number;
  createdAt: string;
}

export default function MyRecipesPage() {
  const { user } = useAuthStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/recipes');
        setRecipes(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar tus recetas');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Recetas</h1>
            <p className="text-secondary mt-2">
              Gestiona y comparte tus creaciones culinarias
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Receta</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-secondary/20 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-secondary/20 rounded w-3/4" />
                <div className="h-4 bg-secondary/20 rounded w-1/2" />
                <div className="h-4 bg-secondary/20 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-secondary/20 bg-background p-8 text-center">
          <ChefHat className="h-12 w-12 text-secondary mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tienes recetas aún</h3>
          <p className="text-secondary mb-4">
            Comienza creando tu primera receta para compartir con la comunidad
          </p>
          <Link
            href="/recipes/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Nueva Receta</span>
          </Link>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              cookingTime={recipe.cookingTime}
              servings={recipe.servings}
              likes={recipe.likes}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useEffect } from 'react';
import { useFavoriteStore } from '@/store/favoriteStore';
import RecipeCard from '@/components/RecipeCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, loading, error, fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Favoritos</h1>
            <p className="text-secondary mt-2">
              Tus recetas favoritas guardadas para acceder fácilmente
            </p>
          </div>
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
      {!loading && !error && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-secondary/20 bg-background p-8 text-center">
          <Heart className="h-12 w-12 text-secondary mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tienes favoritos aún</h3>
          <p className="text-secondary">
            Comienza añadiendo algunas recetas a tus favoritos para acceder a ellas fácilmente
          </p>
        </div>
      )}

      {/* Favorites Grid */}
      {!loading && !error && favorites.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              cookingTime={recipe.cookingTime}
              servings={recipe.servings || 1}
              likes={recipe.likes}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
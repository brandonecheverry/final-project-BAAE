'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

// Datos de ejemplo - Reemplazar con datos reales de tu API
const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    description: 'Deliciosa pasta carbonara con huevo, queso parmesano y panceta.',
    imageUrl: '/images/recipes/carbonara.jpg',
    cookingTime: 30,
    servings: 4,
    likes: 120,
  },
  {
    id: '2',
    title: 'Ensalada César',
    description: 'Ensalada clásica con pollo a la parrilla, crutones y aderezo césar.',
    imageUrl: '/images/recipes/cesar.jpg',
    cookingTime: 20,
    servings: 2,
    likes: 85,
  },
  // Añadir más recetas de ejemplo aquí
];

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const { results, loading, error, search } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cookingTime: '',
    difficulty: '',
    category: '',
    sortBy: 'popular',
  });

  // Manejar el parámetro de búsqueda avanzada en la URL
  useEffect(() => {
    if (searchParams?.get('advanced') === 'true') {
      setShowFilters(true);
    }
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    if (showFilters) {
      // Búsqueda con filtros
      await search({
        type: 'filters',
        cookingTime: filters.cookingTime ? parseInt(filters.cookingTime) : undefined,
        difficulty: filters.difficulty || undefined,
        dietaryRestrictions: {
          vegetarian: filters.category === 'vegetariano',
          vegan: filters.category === 'vegano',
          glutenFree: filters.category === 'sin-gluten',
          dairyFree: filters.category === 'sin-lacteos',
          nutFree: filters.category === 'sin-frutos-secos',
        }
      });
    } else if (searchQuery.trim()) {
      // Búsqueda semántica
      await search({
        type: 'semantic',
        query: searchQuery.trim()
      });
    }
  };

  // Realizar búsqueda cuando cambian los filtros
  useEffect(() => {
    if (showFilters) {
      handleSearch();
    }
  }, [filters]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {showFilters ? 'Búsqueda Avanzada' : 'Explorar Recetas'}
            </h1>
            <p className="text-secondary mt-2">
              {showFilters 
                ? 'Filtra y encuentra exactamente lo que buscas'
                : 'Descubre nuevas recetas y comparte tus creaciones culinarias'}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover transition-colors"
          >
            {showFilters ? (
              <>
                <X className="h-5 w-5" />
                <span>Búsqueda Simple</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="h-5 w-5" />
                <span>Búsqueda Avanzada</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-secondary/20 bg-background py-2 pl-10 pr-4 text-foreground placeholder:text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || (!showFilters && !searchQuery.trim())}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Buscar</span>
            </>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-secondary/20 bg-background p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Tiempo de cocción</label>
              <select 
                className="w-full rounded-lg border border-secondary/20 bg-background px-3 py-2"
                value={filters.cookingTime}
                onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
              >
                <option value="">Cualquier tiempo</option>
                <option value="15">15 minutos o menos</option>
                <option value="30">30 minutos o menos</option>
                <option value="60">1 hora o menos</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Dificultad</label>
              <select 
                className="w-full rounded-lg border border-secondary/20 bg-background px-3 py-2"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">Cualquier nivel</option>
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Categoría</label>
              <select 
                className="w-full rounded-lg border border-secondary/20 bg-background px-3 py-2"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="vegano">Vegano</option>
                <option value="sin-gluten">Sin Gluten</option>
                <option value="sin-lacteos">Sin Lácteos</option>
                <option value="sin-frutos-secos">Sin Frutos Secos</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Ordenar por</label>
              <select 
                className="w-full rounded-lg border border-secondary/20 bg-background px-3 py-2"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popular">Más populares</option>
                <option value="recent">Más recientes</option>
                <option value="rating">Mejor valoradas</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 p-4 text-error">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results?.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!results || results.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-secondary/20 bg-background p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No se encontraron recetas</h3>
          <p className="text-secondary">
            Intenta ajustar tus filtros o busca algo diferente
          </p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Heart } from 'lucide-react';
import { useFavoriteStore } from '@/store/favoriteStore';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookingTime: number;
  servings: number;
  likes?: number;
}

export default function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  cookingTime,
  servings,
  likes = 0,
}: RecipeCardProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const [imgSrc, setImgSrc] = useState<string | null>(imageUrl || null);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
    setImgSrc('/images/recipe-placeholder.jpg');
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-secondary/20 bg-background transition-all hover:shadow-lg">
      <Link href={`/recipes/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={`Imagen de la receta ${title}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          ) : (
            <Image
              src="/images/recipe-placeholder.jpg"
              alt={`Imagen por defecto para la receta ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold line-clamp-1">{title}</h3>
          <p className="mb-4 text-sm text-secondary line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-sm text-secondary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cookingTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{servings} pers.</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(id)}
        className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
        aria-label={isFavorite(id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorite(id) ? 'fill-primary text-primary' : 'text-secondary'
          }`}
        />
      </button>
    </div>
  );
} 
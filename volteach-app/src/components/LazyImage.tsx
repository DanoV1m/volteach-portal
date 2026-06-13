import React, { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  /**
   * Classes applied to the wrapper <div>.
   * Use these for sizing, border-radius, border, shadow — the same classes you
   * would put on the container that previously held the raw <img>.
   */
  className?: string;
  /** Extra classes applied to the <img> element itself (on top of w-full h-full object-cover). */
  imgClassName?: string;
  /**
   * Mark this image as the LCP candidate.
   * Effect: loading="eager" + fetchPriority="high" + decoding="sync".
   * Never use loading="lazy" on an above-the-fold image — it actively hurts LCP.
   */
  priority?: boolean;
  /**
   * Node rendered when the image fails to load (network error, 404, …).
   * Falls back to a generic broken-image SVG icon when omitted.
   */
  fallback?: React.ReactNode;
}

const BrokenIcon = () => (
  <svg
    className="h-1/2 w-1/2 text-slate-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function LazyImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  fallback,
}: LazyImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    // `relative overflow-hidden` is always added so the shimmer + fade work
    // correctly regardless of what sizing/radius classes the caller passes.
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder — shown until the image fires onLoad or onError */}
      {status === 'loading' && (
        <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />
      )}

      {/* The actual image — invisible until loaded, then fades in */}
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          width={undefined}
          height={undefined}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}

      {/* Error fallback — centred inside the same box */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
          {fallback ?? <BrokenIcon />}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

/**
 * Copie l'URL de l'espace client en un clic.
 * Seul composant client de l'app : état éphémère (le libellé « Copié »),
 * rien de persistant.
 */
export function CopyButton({ value, label = 'Copier le lien' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn btn--ghost btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          return; // clipboard refusé (http, permissions) : l'URL reste sélectionnable
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? '✓ Copié' : label}
    </button>
  );
}

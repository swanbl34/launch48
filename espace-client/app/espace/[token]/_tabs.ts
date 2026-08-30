/**
 * Les onglets de l'espace client, définis une fois.
 *
 * Ils étaient recopiés dans chaque page, et avaient déjà divergé : le brief
 * pointait « Suivi » vers l'accueil pendant que le suivi pointait vers
 * /suivi, ce qui n'allumait jamais l'onglet actif.
 */
import type { TabItem } from '@/app/_components/Tabs';

export function clientTabs(
  token: string,
  counts: { tasks: number; brief: number },
): TabItem[] {
  return [
    { href: `/espace/${token}/suivi`, label: 'Suivi' },
    {
      href: `/espace/${token}/taches`,
      label: 'Mes tâches',
      badge: counts.tasks,
      tone: 'warn',
    },
    {
      href: `/espace/${token}/brief`,
      label: 'Mon brief',
      badge: counts.brief,
      tone: 'danger',
    },
  ];
}

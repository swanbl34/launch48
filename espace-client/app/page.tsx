import { redirect } from 'next/navigation';

/** Cette app ne sert que /espace/[token] et /admin. La racine renvoie au site. */
export default function Home() {
  redirect('https://launch48.fr');
}

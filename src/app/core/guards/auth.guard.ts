// vant qu'Angular affiche un composant protégé, il passe d'abord par le Guard qui décide :
//  est-ce que cet utilisateur a le droit d'accéder à cette page


import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';
// CanActivateFn = le type de fonction que doit être un Guard.
// Router = permet de naviguer entre les pages.


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Le flux : 
//Utilisateur tape localhost:4200/history
//        ↓
// Angular vérifie canActivate: [authGuard]
//         ↓
// authGuard cherche le token dans localStorage
//         ↓
// Token trouvé → return true → page affichée
// Token absent → router.navigate('/login') → retour login


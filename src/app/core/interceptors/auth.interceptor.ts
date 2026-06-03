//L'Interceptor est un intermédiaire automatique qui s'insère entre chaque requête HTTP 
// et le backend. Au lieu d'ajouter manuellement le token JWT dans chaque appel API, 
// l'interceptor le fait automatiquement pour toutes les requêtes.


import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  console.log('URL:', req.url);

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Authorization ajouté');
    return next(clonedReq);
  }

  console.log('Pas de token');
  return next(req);
};


//Frontend veut appeler GET /files
//         ↓
// AuthInterceptor intercepte la requête
//         ↓
// Cherche le token dans localStorage
//         ↓
// Token trouvé → clone la requête + ajoute Authorization: Bearer token
//         ↓
// Envoie la requête modifiée au backend
//         ↓
// Backend reçoit le token → JwtFilter valide → accès autorisé

// Token absent → envoie la requête sans modification
//         ↓
// Backend reçoit la requête sans token → accès refusé 401
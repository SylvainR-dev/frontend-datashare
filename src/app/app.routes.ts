// Cela sert à tracer les routes pour les fonctionnalités
// path = URL dans le navigateur
// component = composant Angular à afficher pour l'url concernée

// canActivate: [authGuard] = cela veut dite, avant d'afficher le composant, Angular vérifie le guard. 
// Et si le token existe = cela donne accès autorisé, sinon une redirection /login

// pathMatch: 'full' = la redirection ne s'applique que si l'URL est exactement / 
// et pas /upload ou autre chose


import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './core/guards/auth.guard';
import { Upload } from './pages/upload/upload';
import { Download } from './pages/download/download';
import { History } from './pages/history/history';

export const routes: Routes = [
    {
        path: 'register',
        component: Register
    },
    {
        path: 'login',
        component: Login
    },

    {
        path: 'upload',
        component: Upload,
        canActivate: [authGuard]
    },

    {
        path: 'download/:token',
        component: Download
    },
    {
        path: 'history',
        component: History,
        canActivate: [authGuard]
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
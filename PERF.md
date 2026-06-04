# PERF.md — DataShare Frontend

## Budget de performance — Bundle Angular

Outil : **ng build**  
Date : 04/06/2026

| Fichier | Taille brute | Taille compressée |
|---|---|---|
| main.js | 325.23 kB | 84.26 kB |
| styles.css | 2.26 kB | 600 bytes |
| **Total** | **327.49 kB** | **84.86 kB** |

Budget cible : < 500 kB — ✅ Respecté

## Métriques navigateur — Lighthouse

Outil : **Chrome Lighthouse**  
Date : 04/06/2026  
URL testée : `http://localhost:4200`

| Catégorie | Score |
|---|---|
| Performance | 75 |
| Accessibility | 93 |
| Best Practices | 77 |
| SEO | 90 |

![Rapport Lighthouse](docs/lighthouse-report.html)

### Métriques de performance détaillées

| Métrique | Valeur | Statut |
|---|---|---|
| First Contentful Paint | 1.7s | ⚠️ Moyen |
| Largest Contentful Paint | 2.7s | ⚠️ À améliorer |
| Total Blocking Time | 0ms | ✅ Excellent |
| Cumulative Layout Shift | 0.001 | ✅ Excellent |
| Speed Index | 2.1s | ⚠️ Moyen |

### Interprétation

Le score de performance de **75** est correct pour une application Angular en développement 
local. Les points forts sont le **Total Blocking Time à 0ms** et le **CLS quasi nul**, 
ce qui indique une interface stable sans blocage du thread principal.

Le LCP à 2.7s et le FCP à 1.7s sont liés au temps de démarrage de l'application Angular 
(chargement du bundle JS). Ces valeurs sont normales pour une SPA et pourraient être 
améliorées en production avec la mise en cache et la compression gzip activée sur le serveur.
# Site tada-ko — Tadayoshi Kokeguchi

Site portfolio (danseur, choregraphe, enseignant) — version autonome reconstruite
a partir du site Wix, prete a etre hebergee sur Vercel avec le domaine **tada-ko.fr**.

## Structure
- `index.html` ............. Accueil
- `enseignement.html` ...... Enseignement (danse classique / tango argentin)
- `choregraphie.html` ...... Liste des oeuvres
- `tableaux-d-exposition.html`, `intangibles.html`, `may-contain-traces-of.html`,
  `fences.html`, `fossil.html`, `from-corridors-to-mirrors.html`, `compositions.html`
- `bio-contact.html` ....... Biographie + formulaire de contact
- `acces-pro.html` ......... Espace reserve (connexion par mot de passe)
- `css/style.css`, `js/main.js`
- `vercel.json` ............ configuration Vercel (URLs propres)

## Backend Supabase
- Projet : **tada-ko** (region Paris / eu-west-3)
- URL : https://jiwnhpyugybtazlkgmma.supabase.co
- Table `contact_messages` : recoit les messages du formulaire de contact.
  -> Pour les lire : Dashboard Supabase > Table Editor > contact_messages.
- Table `pro_resources` : contenu de l'espace Accès Pro (visible apres connexion).
- Authentification (e-mail / mot de passe) : protege la page Accès Pro.

### Donner un acces Pro a quelqu'un
Dashboard Supabase > Authentication > Users > "Add user" > cocher "Auto Confirm User".

## Deploiement (Vercel)
1. Mettre ce dossier sur un depot GitHub.
2. Sur vercel.com : New Project > importer le depot > Framework preset "Other" > Deploy.
3. Project Settings > Domains > ajouter `tada-ko.fr` et `www.tada-ko.fr`.
4. Chez LWS, configurer les DNS indiques par Vercel (enregistrement A + CNAME).

## Note sur les images
Les images pointent actuellement vers le CDN de Wix (elles t'appartiennent).
Elles peuvent etre re-hebergees plus tard dans un dossier `/images` pour rendre
le site 100% independant de Wix.

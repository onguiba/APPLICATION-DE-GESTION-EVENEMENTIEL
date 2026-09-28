# Requirements: Provider Dashboard & App Rebranding (Lynkéné)

## 🎯 Contexte Global

**Nom de l'application:** Lynkéné
**Couleurs:** Blanc, Vert dégradé
**Statut:** Rebranding complet + Nouvelles fonctionnalités

---

## 📋 REMARQUES CRITIQUES À CORRIGER

### 1. PAGE PRESTATAIRE (Provider Dashboard)

#### 1.1 Onglet "Actualité" (News Feed)
**Priorité:** 🔴 CRITIQUE

**Fonctionnalités:**
- Afficher un formulaire pour publier une offre
- Champs du formulaire:
  - Sélection du prestataire (dropdown)
  - Description de l'offre
  - Prix
- Affichage des offres publiées
- Possibilité de modifier/supprimer ses offres

**Données à capturer:**
```
Offre {
  id: number
  providerId: number
  serviceType: string (Catering, Décoration, Photographie, etc.)
  description: string
  price: number
  status: string (Publiée, Brouillon, Archivée)
  createdAt: DateTime
}
```

#### 1.2 Onglet "Événement"
**Priorité:** 🔴 CRITIQUE

**Fonctionnalités:**
- Afficher UNIQUEMENT les événements où le prestataire doit prester
- Filtrer par:
  - Statut (Planifié, En cours, Terminé)
  - Type de service
  - Date

**Logique:**
- Un prestataire voit un événement seulement si:
  - Son offre a été acceptée
  - Il a un contrat actif
  - L'événement n'est pas annulé

#### 1.3 Onglet "Participant"
**Priorité:** 🔴 CRITIQUE

**Modifications:**
- ❌ ENLEVER: "Scanner code QR"
- ✅ AJOUTER: Filtre pour la liste des participants
- ✅ AJOUTER: Répartition du budget pour un événement précis

**Filtres à ajouter:**
- Par nom
- Par statut de paiement
- Par date d'inscription
- Par événement

**Répartition budgétaire:**
- Afficher le budget total de l'événement
- Afficher la répartition par catégorie
- Afficher la part du prestataire

#### 1.4 Bouton "Voir les prestataires"
**Priorité:** 🟡 IMPORTANT

**Modification:**
- ❌ ENLEVER: Le "+" sur le bouton
- Garder le texte "Voir les prestataires"

#### 1.5 Notifications
**Priorité:** 🔴 CRITIQUE

**Exigences:**
- ✅ OBLIGATOIRE: Fonctionner (Email, Push)
- ✅ OBLIGATOIRE: Bouton "Envoyer une notification" doit fonctionner
- ✅ OBLIGATOIRE: Arranger les couleurs

**Types de notifications:**
- Nouvelle offre reçue
- Offre acceptée/refusée
- Paiement reçu
- Mise à jour d'événement

#### 1.6 Modes de Paiement
**Priorité:** 🟡 IMPORTANT

**Modification:**
- ❌ ENLEVER: Les modes de paiement (MoMo, OrangeMoney, Card, etc.)

#### 1.7 Répartition par Type
**Priorité:** 🟡 IMPORTANT

**Modification:**
- ❌ ENLEVER: Le "%" à côté de la répartition par type
- Garder les valeurs absolues (ex: "5000 FCFA" au lieu de "5000 FCFA (10%)")

---

### 2. FORMULAIRE DE CRÉATION D'ÉVÉNEMENT

#### 2.1 Demande de Paiement Automatique
**Priorité:** 🔴 CRITIQUE

**Fonctionnalité:**
- À la finalisation de la création d'un événement
- Créer automatiquement une demande de paiement
- Montant = Valeur budgétaire de l'événement
- Envoyer une notification à l'organisateur

**Logique:**
```
Événement créé
  ↓
Calculer le budget total
  ↓
Créer une demande de paiement
  ↓
Envoyer notification à l'organisateur
  ↓
Afficher le statut du paiement
```

---

### 3. REBRANDING - LYNKÉNÉ

#### 3.1 Couleurs
**Palette:**
- Blanc: #FFFFFF
- Vert dégradé: #10B981 → #059669 (ou similaire)
- Texte: #1F2937 (gris foncé)
- Fond: #F9FAFB (gris très clair)

#### 3.2 Page d'Accueil
**Modifications:**
- ❌ ENLEVER: Les propositions d'abonnement
- ✅ AJOUTER: Images (logo, illustrations)
- ✅ CHANGER: Les couleurs (vert dégradé)
- ❌ ENLEVER: Le mot "participant" qui revient plusieurs fois

**Textes à remplacer:**
- "Participant" → "Invité" ou "Attendee"
- "Participants" → "Invités" ou "Attendees"

#### 3.3 Images à Ajouter
- Logo Lynkéné
- Illustrations pour les sections principales
- Icônes pour les fonctionnalités

---

### 4. FONCTIONNALITÉS OBLIGATOIRES

#### 4.1 Code QR
**Priorité:** 🔴 CRITIQUE

**Exigences:**
- ✅ Chez participant: Code QR unique
- ✅ Chez serveur: Code QR unique
- ✅ Chaque code doit être unique par événement

**Utilisation:**
- Accès à l'événement
- Vérification de présence
- Accès aux informations

#### 4.2 Lien Individuel
**Priorité:** 🔴 CRITIQUE

**Exigences:**
- ✅ Lien unique pour chaque participant
- ✅ Pour événements privés
- ✅ Format: `/events/[eventId]/participant/[participantId]`

#### 4.3 Notifications
**Priorité:** 🔴 CRITIQUE

**Exigences:**
- ✅ OBLIGATOIRE: Fonctionner
- ✅ Canaux: Email, Push
- ✅ Types: Offres, Paiements, Mises à jour

#### 4.4 Gestion des Budgets
**Priorité:** 🔴 CRITIQUE

**Exigences:**
- ✅ Répartition par catégorie
- ✅ Alertes obligatoires (> 85% utilisé)
- ✅ Affichage du budget restant
- ✅ Historique des dépenses

---

## 📊 Résumé des Modifications

| Élément | Action | Priorité |
|---------|--------|----------|
| Onglet Actualité (Prestataire) | Ajouter | 🔴 |
| Onglet Événement (Prestataire) | Filtrer | 🔴 |
| Scanner QR (Participant) | Enlever | 🔴 |
| Filtre Participants | Ajouter | 🔴 |
| Répartition Budget | Ajouter | 🔴 |
| Bouton "+" | Enlever | 🟡 |
| Notifications | Corriger | 🔴 |
| Bouton Notification | Corriger | 🔴 |
| Modes de Paiement | Enlever | 🟡 |
| "%" Répartition | Enlever | 🟡 |
| Paiement Automatique | Ajouter | 🔴 |
| Rebranding Lynkéné | Complet | 🔴 |
| Code QR | Implémenter | 🔴 |
| Lien Individuel | Implémenter | 🔴 |
| Enlever "Participant" | Remplacer | 🟡 |

---

## 🎯 Priorités d'Implémentation

### Phase 1 (Immédiate - Critiques)
1. Onglet Actualité (Prestataire) - Publier offres
2. Onglet Événement (Prestataire) - Filtrer
3. Onglet Participant - Filtre + Répartition budget
4. Notifications - Corriger et tester
5. Paiement Automatique - À la création d'événement

### Phase 2 (Court terme)
1. Rebranding Lynkéné - Couleurs et images
2. Code QR - Unique par participant
3. Lien Individuel - Pour événements privés
4. Enlever modes de paiement
5. Enlever "%" répartition

### Phase 3 (Moyen terme)
1. Page d'accueil - Enlever abonnements
2. Remplacer "Participant" par "Invité"
3. Ajouter images et illustrations
4. Optimiser les couleurs

---

## 📝 Notes Importantes

- Les notifications DOIVENT fonctionner (Email + Push)
- Le paiement automatique est OBLIGATOIRE
- Le code QR doit être unique et fonctionnel
- Les couleurs doivent être cohérentes (vert dégradé)
- Tous les changements doivent être testés


```
ALGORITHME Labyrinthe

    Initialiser tableau "chemin"

    FONCTION "ecrireChemin"
        Récupérer la position
        Insérer la position dans le tableau "chemin"
        Récupérer les cases adjacentes où il est possible d'aller
        IF la case n'est pas dans le tableau "chemin"
            Déplacer sur cette case
            "ecrireChemin"
        ELSE Continue

//
    Si toutes les cases ont été visitées
    Revenir sur la case précendente

```
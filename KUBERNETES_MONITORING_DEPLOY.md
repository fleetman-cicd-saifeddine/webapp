# Déploiement du Monitoring sur Kubernetes

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Kubernetes Cluster (k8s)                │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Monitoring Namespace                │  │
│  │                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │Prometheus│  │ Grafana  │  │Alertmgr│ │  │
│  │  │ Pod      │  │ Pod      │  │ Pod    │ │  │
│  │  └──────────┘  └──────────┘  └────────┘ │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Default Namespace                   │  │
│  │                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │Jenkins   │  │SonarQube │  │Webapp  │ │  │
│  │  │Pod       │  │Pod       │  │Pod     │ │  │
│  │  └──────────┘  └──────────┘  └────────┘ │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Prérequis

- Kubernetes cluster en cours d'exécution
- kubectl configuré
- Au moins 2GB de mémoire disponible
- Au moins 1 CPU disponible

## Étape 1 : Vérifier Kubernetes

```bash
# Vérifier le statut du cluster
kubectl cluster-info

# Vérifier les nœuds
kubectl get nodes

# Vérifier les pods
kubectl get pods -A
```

## Étape 2 : Créer les fichiers YAML

Créez un répertoire pour le monitoring :

```bash
mkdir -p ~/k8s/webapp/monitoring
cd ~/k8s/webapp/monitoring
```

Créez les fichiers :

1. **prometheus-deployment.yaml**
2. **grafana-deployment.yaml**
3. **alertmanager-deployment.yaml**

## Étape 3 : Déployer Prometheus

```bash
kubectl apply -f prometheus-deployment.yaml

# Vérifier le déploiement
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

## Étape 4 : Déployer Grafana

```bash
kubectl apply -f grafana-deployment.yaml

# Vérifier le déploiement
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

## Étape 5 : Déployer Alertmanager

```bash
kubectl apply -f alertmanager-deployment.yaml

# Vérifier le déploiement
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

## Étape 6 : Accéder aux services

### Obtenir les ports NodePort

```bash
kubectl get svc -n monitoring

# Résultat attendu :
# NAME           TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)
# prometheus     NodePort   10.96.xxx.xxx   <none>        9090:30090/TCP
# grafana        NodePort   10.96.xxx.xxx   <none>        3000:30300/TCP
# alertmanager   NodePort   10.96.xxx.xxx   <none>        9093:30093/TCP
```

### Accéder aux services

- **Prometheus** : http://192.168.79.129:30090
- **Grafana** : http://192.168.79.129:30300 (admin/admin123)
- **Alertmanager** : http://192.168.79.129:30093

## Étape 7 : Configurer Grafana

### Ajouter Prometheus comme source de données

1. Allez sur http://192.168.79.129:30300
2. Connectez-vous (admin/admin123)
3. Allez sur Configuration → Data Sources
4. Cliquez sur "Add data source"
5. Sélectionnez "Prometheus"
6. URL : http://prometheus:9090
7. Cliquez sur "Save & Test"

### Créer des dashboards

1. Allez sur Dashboards → New Dashboard
2. Ajoutez des panels avec des requêtes Prometheus
3. Exemples de requêtes :
   - `up` - Statut des services
   - `jenkins_builds_total` - Nombre de builds Jenkins
   - `container_memory_usage_bytes` - Mémoire utilisée
   - `container_cpu_usage_seconds_total` - CPU utilisé

## Commandes utiles

```bash
# Voir les logs d'un pod
kubectl logs -n monitoring prometheus-xxxxx
kubectl logs -n monitoring grafana-xxxxx
kubectl logs -n monitoring alertmanager-xxxxx

# Accéder à un pod
kubectl exec -it -n monitoring prometheus-xxxxx -- /bin/sh

# Supprimer un pod (il sera recréé)
kubectl delete pod -n monitoring prometheus-xxxxx

# Voir les événements
kubectl get events -n monitoring

# Voir les ressources utilisées
kubectl top pods -n monitoring
kubectl top nodes

# Redémarrer un déploiement
kubectl rollout restart deployment/prometheus -n monitoring
```

## Troubleshooting

### Prometheus ne scrape pas les métriques

1. Vérifier la configuration :
   ```bash
   kubectl get configmap -n monitoring prometheus-config -o yaml
   ```

2. Vérifier les logs :
   ```bash
   kubectl logs -n monitoring prometheus-xxxxx
   ```

3. Vérifier la connectivité :
   ```bash
   kubectl exec -it -n monitoring prometheus-xxxxx -- wget http://jenkins.default.svc.cluster.local:8080
   ```

### Grafana ne se connecte pas à Prometheus

1. Vérifier que Prometheus est en cours d'exécution :
   ```bash
   kubectl get pods -n monitoring
   ```

2. Vérifier la configuration de la source de données dans Grafana

3. Vérifier la connectivité :
   ```bash
   kubectl exec -it -n monitoring grafana-xxxxx -- wget http://prometheus:9090
   ```

### Les alertes ne sont pas envoyées

1. Vérifier la configuration d'Alertmanager :
   ```bash
   kubectl get configmap -n monitoring alertmanager-config -o yaml
   ```

2. Vérifier les logs :
   ```bash
   kubectl logs -n monitoring alertmanager-xxxxx
   ```

## Prochaines étapes

1. Configurer les webhooks Slack
2. Créer des dashboards personnalisés
3. Configurer les alertes
4. Ajouter des exporters supplémentaires
5. Configurer la persistance des données

## Ressources

- [Prometheus Kubernetes Documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config)
- [Grafana Kubernetes Documentation](https://grafana.com/docs/grafana/latest/installation/kubernetes/)
- [Kubernetes Monitoring Best Practices](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)

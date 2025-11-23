# Monitoring et Alertes - Guide de Déploiement

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Monitoring Stack                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Prometheus  │  │   Grafana    │  │Alertmanager│ │
│  │   (9090)     │  │   (3000)     │  │  (9093)    │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│         ▲                  ▲                  ▲       │
│         │                  │                  │       │
│  ┌──────┴──────────────────┴──────────────────┴────┐ │
│  │         Data Collection & Alerting              │ │
│  │  - Jenkins Metrics                              │ │
│  │  - SonarQube Metrics                            │ │
│  │  - Kubernetes Metrics                           │ │
│  │  - System Metrics (CPU, Memory, Disk)           │ │
│  │  - Application Metrics                          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │Node Exporter │  │   cAdvisor   │                 │
│  │   (9100)     │  │   (8080)     │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Installation

### 1. Prérequis

- Docker et Docker Compose installés
- Port 9090 (Prometheus) disponible
- Port 3000 (Grafana) disponible
- Port 9093 (Alertmanager) disponible

### 2. Déployer la stack de monitoring

```bash
# Créer le répertoire
mkdir -p monitoring
cd monitoring

# Copier les fichiers de configuration
cp prometheus.yml .
cp alert_rules.yml .
cp alertmanager.yml .
cp docker-compose-monitoring.yml docker-compose.yml

# Démarrer les services
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

### 3. Accéder aux services

- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000 (admin/admin123)
- **Alertmanager** : http://localhost:9093

## Configuration

### Prometheus

**Fichier** : `prometheus.yml`

**Scrape Targets** :
- Jenkins (localhost:8080)
- SonarQube (192.168.79.129:9000)
- Kubernetes (localhost:10250)
- Docker (localhost:9323)
- Webapp (192.168.79.129:30080)

**Interval** : 15s (global), 10s (Jenkins), 30s (SonarQube)

### Alertes

**Fichier** : `alert_rules.yml`

**Catégories d'alertes** :
1. **Jenkins Alerts** (4 alertes)
   - Build failure
   - High queue
   - High executor usage
   - Disk space low

2. **SonarQube Alerts** (4 alertes)
   - Quality gate failed
   - High technical debt
   - Security issues
   - Low coverage

3. **Kubernetes Alerts** (4 alertes)
   - Pod restarting
   - Pod not ready
   - Node not ready
   - High memory usage

4. **Application Alerts** (3 alertes)
   - High error rate
   - High latency
   - Service down

5. **Infrastructure Alerts** (4 alertes)
   - High CPU usage
   - High memory usage
   - Disk space low
   - Network errors

### Alertmanager

**Fichier** : `alertmanager.yml`

**Routage des alertes** :
- **Critical** → Slack + Email (immédiat)
- **Warning** → Slack (batch)
- **Jenkins** → #jenkins-alerts
- **SonarQube** → #code-quality
- **Kubernetes** → #kubernetes-alerts

## Grafana Dashboards

### Dashboard 1 : Jenkins Overview

**Métriques** :
- Build success rate
- Build duration
- Queue size
- Executor usage
- Disk space

### Dashboard 2 : SonarQube Quality

**Métriques** :
- Quality gate status
- Code coverage
- Technical debt
- Security issues
- Code smells

### Dashboard 3 : Kubernetes Health

**Métriques** :
- Pod status
- Node status
- Memory usage
- CPU usage
- Network traffic

### Dashboard 4 : Application Performance

**Métriques** :
- Request rate
- Error rate
- Latency (p50, p95, p99)
- Throughput
- Response time

### Dashboard 5 : Infrastructure

**Métriques** :
- CPU usage
- Memory usage
- Disk usage
- Network errors
- System load

## Slack Integration

### Configuration

1. Créer un Webhook Slack :
   - Aller sur https://api.slack.com/apps
   - Créer une nouvelle app
   - Activer "Incoming Webhooks"
   - Copier l'URL du webhook

2. Mettre à jour `alertmanager.yml` :
   ```yaml
   global:
     slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'
   ```

3. Redémarrer Alertmanager :
   ```bash
   docker-compose restart alertmanager
   ```

### Canaux Slack

- `#devops-alerts` - Alertes générales
- `#critical-alerts` - Alertes critiques
- `#devops-warnings` - Avertissements
- `#jenkins-alerts` - Alertes Jenkins
- `#code-quality` - Alertes SonarQube
- `#kubernetes-alerts` - Alertes Kubernetes

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f alertmanager

# Arrêter les services
docker-compose down

# Redémarrer un service
docker-compose restart prometheus

# Voir les métriques Prometheus
curl http://localhost:9090/api/v1/query?query=up

# Voir les alertes actives
curl http://localhost:9090/api/v1/alerts

# Voir les alertes Alertmanager
curl http://localhost:9093/api/v1/alerts
```

## Troubleshooting

### Prometheus ne scrape pas les métriques

1. Vérifier la configuration `prometheus.yml`
2. Vérifier que les targets sont accessibles
3. Vérifier les logs : `docker-compose logs prometheus`

### Grafana ne se connecte pas à Prometheus

1. Vérifier que Prometheus est en cours d'exécution
2. Ajouter la source de données : http://prometheus:9090
3. Tester la connexion

### Alertes ne sont pas envoyées

1. Vérifier la configuration `alertmanager.yml`
2. Vérifier le Slack webhook URL
3. Vérifier les logs : `docker-compose logs alertmanager`

## Métriques importantes

### Jenkins

- `jenkins_builds_total` - Nombre total de builds
- `jenkins_builds_failed_total` - Nombre de builds échoués
- `jenkins_queue_size` - Taille de la queue
- `jenkins_executors_busy` - Exécuteurs occupés
- `jenkins_executors_total` - Total des exécuteurs

### SonarQube

- `sonarqube_quality_gate_status` - Statut du quality gate
- `sonarqube_coverage_percentage` - Couverture de code
- `sonarqube_technical_debt_minutes` - Dette technique
- `sonarqube_security_issues` - Problèmes de sécurité
- `sonarqube_code_smells` - Code smells

### Kubernetes

- `kube_pod_status_phase` - Phase du pod
- `kube_node_status_condition` - Condition du nœud
- `container_memory_usage_bytes` - Mémoire utilisée
- `container_cpu_usage_seconds_total` - CPU utilisé

### Application

- `http_requests_total` - Nombre total de requêtes
- `http_request_duration_seconds` - Durée des requêtes
- `http_requests_total{status=~"5.."}` - Erreurs serveur

## Prochaines étapes

1. Configurer les dashboards Grafana
2. Configurer les notifications Slack
3. Configurer les alertes email
4. Ajouter des métriques personnalisées
5. Configurer la rétention des données
6. Configurer les sauvegardes

## Ressources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/overview/)
- [Node Exporter Metrics](https://github.com/prometheus/node_exporter)

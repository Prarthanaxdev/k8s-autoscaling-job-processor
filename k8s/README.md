# k8s Folder Structure

This directory contains all Kubernetes manifests for deploying and managing the microservices system.

## Structure

- `redis/` - Redis deployment and secret manifests
- `service-a/` - Service A (Job Submitter) deployment, service, ingress, and configmap
- `service-b/` - Service B (Worker) deployment, service, HPA, ServiceMonitor, and configmap
- `service-c/` - Service C (Stats/Aggregator) deployment, service, ServiceMonitor, and configmap
- `monitoring/` - Grafana dashboards, Prometheus scrape configs, and alert rules
- `ingress-nginx-controller-patch.json` - (optional) Patch for ingress controller


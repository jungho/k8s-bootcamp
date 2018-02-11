echo "Deleteing Grafana ..... "
helm delete grafana
echo "Deleteing Prometheus ... "
helm delete prometheus
echo "Purging helm charts "
helm del --purge grafana
helm del --purge prometheus

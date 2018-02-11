FROM scratch
#required for TLS
ADD ca-certificates.crt /etc/ssl/certs/
ADD main /
ENV STOCK_QUOTE_SERVICE "https://api.iextrading.com/1.0/stock"
CMD ["/main"]
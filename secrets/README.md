# Secrets #

Almost all applications have a need to access other services using sensitive data such as credentials or keys.  For non-senstive configuration data, you can just you configmaps but for things like credentials or keys you should use secrets.

## References ##

- [Secrets @ k8s.io](https://kubernetes.io/docs/concepts/configuration/secret/)
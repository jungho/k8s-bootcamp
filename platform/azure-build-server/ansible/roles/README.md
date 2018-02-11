## Modifications to imported roles: ##

- `geerlinguy.sonar`:
  - `main.yml` task - added `become: yes` to following tasks:
    - "Create a database for Sonar."
    - "Create a sonar user."

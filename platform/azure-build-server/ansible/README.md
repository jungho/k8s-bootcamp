## Provisioning Ansible playbook for Jenkins/Sonar build server VM ##

This Ansible playbook sets up Jenkins/Sonar server on it with plugins installed and Azure Kubernetes cluster access configured

## Pre-requisited ##

- The following CLI tools are required:
  - `ansible-playbook` - Ansible Playbook tool (v2.4.2.0 or later)

## Get Started ##

To provision the Jenkins/Sonar server, run the following command:

`ansible-playbook -vv -i hosts.ini build-server.yml --diff`

- `-vv` - Verbose output
- `-i hosts.ini` - Specifies the hosts file which was has the VM host defined
- `build-server.yml` - Ansible playbook that sets up Jenkins/Sonar
- `--diff` - Prints out the changes made on the VM

## Explanation ##

This playbook configures the following roles in order:

1. Asks user to input admin username and password for Jenkins and Sonar
2. Manually installs a community MySQL repo to be able to install newer version of MySQL since SonarQube requires MySQL 5.6+ and CentOS 7 comes with MySQL 5.5
3. Common role:
    - Upgrade all packages
    - Install EPEL repo
    - Install Git
    - Configures SELinux

4. Nginx role:
    - Installs Nginx
    - Forwards traffic from `/` to `127.0.0.1:8080` (Jenkins)
    - Forwards traffic from `/sonar` to `127.0.0.1:9000/sonar` (Sonar)

5. Java (`geerlingguy.java`) role:
    - Installs Java 8

6. MySQL (`geerlingguy.mysql`) role:
    - Installs MySQL

7. Sonar role:
    - Installs SonarQube server
    - Configures it to use MySQL database

8. Jenkins (`geerlingguy.jenkins`) role:
    - Installs and configures Jenkin
    - Pre-installs the following Jenkins plugins:
        - git
        - build-pipeline-plugin
        - pipeline-stage-view
        - blueocean
        - sonar
        - kubernetes
        - kubernetes-cd
        - azure-acs

9. Docker role:
    - Installs Docker
    - Installs Docker Compose

10. Configure Jenkins role:
    - Sets up Jenkins access to Sonar server
    - Pre-configures Jenkins server
    - Pre-configures Sonar plugin

11. Kubectl role:
    - Installs kubectl command line tool on Jenkins
    - Configures access for kubectl to Kubernetes cluster

## The following roles were installed from Ansible Galaxy: ##
- geerlingguy.jenkins
- geerlingguy.java
- geerlingguy.mysql

They were installed using the following command:
- `ansible-galaxy install geerlingguy.jenkins -p ./roles/` from directory where the playbook is located
  - `./roles/` path is the location of the roles

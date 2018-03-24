# Jobs and CronJobs #

Jobs are a familiar concept in many systems.  Jobs in K8S are pods that execute a task and runs to completion.  Unlike, Deployments, Statefulsets, Replicasets that are meant to run continuously (e.g. they are restarted when they fail, and keeps on running to no well-defined end), Jobs perform a task to completion then end.  In this case, end means completed successfully. If the Job fails, it can be configured to restart.  Therefore, Jobs are for those tasks that need to complete successfully, and be cleaned up once that objective is met.

## Running the example 

```sh
#deploy the sample job.  This job just prints a message to stdin 30 times then exits.
kubectl create -f job.yml

kubectl get jobs/batch-job

#this shows that we desire 4 successful completions 
#and currently there are 0 successful completions
NAME        DESIRED   SUCCESSFUL   AGE
batch-job   4         0            3m
```

You can also schedule jobs to run at a certain time.  See [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) at K8S.io.

## References ##

- [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
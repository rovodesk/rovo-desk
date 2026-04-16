# zero-heads

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](#statements#) | ![Branches](#branches#) | ![Functions](#functions#) | ![Lines](#lines#) |


#### Analytics Events

- user_deleted
- user_logged_in
- user_logged_out
- user_signed_up

- organization_created
- organization_deleted

- onboarding_progress

### Infra 

```
infra/
├── kubernetes/
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── ingress.yaml
│   │   └── configmap.yaml
│   │
│   ├── apps/
│   │   ├── auth-service/
│   │   ├── user-service/
│   │   └── analytics-service/
│   │
│   └── helm/
│       ├── charts/
│       └── values/
│
├── ansible/
│   ├── inventories/
│   ├── roles/
│   └── playbooks/
│
└── scripts/
```
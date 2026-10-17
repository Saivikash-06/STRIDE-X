# STRIDE-X Relational Schema Documentation

## Entity Relationship Overview

```
                      +-------------------+
                      |      schemes      |
                      +-------------------+
                                | 1
                                |
                                | *
                      +-------------------+         1 +-------------------+
                      |     projects      |-----------|   organizations   |
                      +-------------------+           +-------------------+
                                | 1
        +-----------+-----------+-----------+-----------+
        | *         | *         | *         | *         | *
+---------------+ +---------+ +-----------+ +-------+ +------------------+
| beneficiaries | | audits  | |grievances | |budgets| |monitoring_records|
+---------------+ +---------+ +-----------+ +-------+ +------------------+
```

## Security & Privacy Rules
- **No Raw Aadhaar Numbers**: Only verified booleans and synthetic IDs are recorded.
- **Financial Precision**: Money columns use `Numeric(12, 2)` or `Numeric(10, 2)`. Float arithmetic is prohibited.
- **Jurisdiction Indexing**: `state` and `district` columns are indexed across `projects`, `beneficiaries`, and `organizations` for high-speed scoped queries.

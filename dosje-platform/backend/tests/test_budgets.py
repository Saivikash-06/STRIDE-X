def test_budget_allocation_and_expenditure_flow(client):
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    admin_token = admin_login.json()["access_token"]

    # 1. Sanction new budget
    budget_res = client.post(
        "/api/v1/projects/test-proj-1/budgets",
        json={
            "project_id": "test-proj-1",
            "fiscal_year": "2026-27",
            "sanctioned_amount": 500000.0,
            "allocation_date": "2026-04-01",
            "notes": "Q1 Infrastructure allocation",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert budget_res.status_code == 201
    assert budget_res.json()["sanctionedAmount"] == 500000.0

    # 2. Reject negative budget
    invalid_res = client.post(
        "/api/v1/projects/test-proj-1/budgets",
        json={
            "project_id": "test-proj-1",
            "fiscal_year": "2026-27",
            "sanctioned_amount": -1000.0,
            "allocation_date": "2026-04-01",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert invalid_res.status_code == 400

    # 3. NGO submits valid expenditure
    ngo_login = client.post(
        "/api/v1/auth/login",
        json={"email": "ngo@test.org", "password": "Demo@123"},
    )
    ngo_token = ngo_login.json()["access_token"]

    exp_res = client.post(
        "/api/v1/projects/test-proj-1/expenditures",
        json={
            "amount": 150000.0,
            "category": "INFRASTRUCTURE",
            "description": "Smart classroom renovation and repair",
            "invoice_reference": "INV-PUN-2026-042",
        },
        headers={"Authorization": f"Bearer {ngo_token}"},
    )
    assert exp_res.status_code == 201
    exp_data = exp_res.json()
    assert exp_data["approvalStatus"] == "SUBMITTED"
    exp_id = exp_data["id"]

    # 4. Admin approves expenditure
    approve_res = client.patch(
        f"/api/v1/expenditures/{exp_id}/status",
        json={"approval_status": "APPROVED"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["approvalStatus"] == "APPROVED"

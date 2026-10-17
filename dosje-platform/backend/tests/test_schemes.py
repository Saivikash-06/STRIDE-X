def test_list_schemes_authenticated(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    token = login_res.json()["access_token"]

    response = client.get("/api/v1/schemes", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 1
    assert schemes[0]["code"] == "PM-AJAY-TEST"


def test_admin_create_scheme(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    token = login_res.json()["access_token"]

    new_scheme_payload = {
        "code": "SMILE-TEST-NEW",
        "name": "SMILE New Scheme Test",
        "category": "Transgender Rehabilitation",
        "target_group": "Marginalized individuals",
        "budget_allocated_cr": 45.0,
        "status": "ACTIVE",
    }
    response = client.post(
        "/api/v1/schemes",
        json=new_scheme_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    created = response.json()
    assert created["code"] == "SMILE-TEST-NEW"


def test_ngo_forbidden_from_creating_scheme(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "ngo@test.org", "password": "Demo@123"},
    )
    token = login_res.json()["access_token"]

    new_scheme_payload = {
        "code": "UNAUTHORIZED-SCHEME",
        "name": "Should Fail",
        "category": "General",
        "target_group": "None",
    }
    response = client.post(
        "/api/v1/schemes",
        json=new_scheme_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403

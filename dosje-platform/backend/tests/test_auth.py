def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123", "remember_me": False},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_nonexistent_email(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ghost@nonexistent.gov", "password": "Demo@123"},
    )
    assert response.status_code == 401


def test_auth_me_authenticated(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    token = login_res.json()["access_token"]

    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == "admin@test.gov"
    assert user_data["role"] == "admin"


def test_auth_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_refresh_token(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.gov", "password": "Demo@123"},
    )
    refresh_tok = login_res.json()["refresh_token"]

    refresh_res = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_tok},
    )
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data

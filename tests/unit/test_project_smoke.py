from app.core.config import APP_NAME, APP_VERSION


def test_app_identity() -> None:
    assert APP_NAME
    assert APP_VERSION == "V1.0"

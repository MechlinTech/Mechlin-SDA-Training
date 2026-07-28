from ai.models import MLModelFactory

def test_model_factory():
    factory = MLModelFactory()
    model = factory.create_classifier("random_forest")
    assert model is not None
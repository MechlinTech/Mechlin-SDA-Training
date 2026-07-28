from ai.data_pipeline import DataPipeline

def test_pipeline_creation():
    pipeline = DataPipeline()
    assert pipeline is not None
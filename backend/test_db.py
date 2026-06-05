from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Hasa%4022062003@localhost:5432/insightforge"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("SUCCESS")
    conn.close()
except Exception as e:
    print("ERROR:")
    print(e)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from models import Article, Source, RssItem  # noqa: F401
    from sqlalchemy import text

    Base.metadata.create_all(bind=engine)

    # Migrazione: aggiunge rss_content se non esiste (DB già esistente)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE rss_items ADD COLUMN rss_content TEXT"))
            conn.commit()
        except Exception:
            pass  # colonna già presente

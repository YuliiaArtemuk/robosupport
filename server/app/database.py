import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Retrieve DATABASE_URL from environment variables (set in Docker Compose)
DATABASE_URL = os.getenv("DATABASE_URL")

# Set up the database engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for ORM models to inherit from
Base = declarative_base()

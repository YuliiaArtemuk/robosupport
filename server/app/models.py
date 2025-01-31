from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Mapped

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)


class Software(Base):
    __tablename__ = 'sw'
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String)
    commit_hash = Column(String)
    path = Column(String)
    kind = Column(ForeignKey("kind.id"))


class Task(Base):
    __tablename__ = 'task'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Kind(Base):
    __tablename__ = 'kind'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Instance(Base):
    __tablename__ = 'instances'
    id = Column(Integer, primary_key=True, index=True)
    manufacture_number = Column(Integer, index=True, unique=True)
    schedule_interval = Column(Integer, default=300)
    last_ping = Column(DateTime, nullable=True)
    username = Column(String, nullable=True)
    pwd_salt = Column(String, nullable=True)
    kind_id = Column(ForeignKey("kind.id"))
    task_id = Column(ForeignKey("task.id"))
    sw_id = Column(ForeignKey("sw.id"))
    logs = relationship("Log", back_populates='instance')
    kind: Mapped["Kind"] = relationship()
    sw: Mapped["Software"] = relationship()
    task: Mapped["Task"] = relationship()


class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True)
    md5_sum = Column(String)
    instance = relationship("Instance", back_populates='logs')
    instance_id = Column(Integer, ForeignKey("instances.id"))


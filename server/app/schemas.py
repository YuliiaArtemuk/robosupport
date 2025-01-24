from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int


# Software Schemas
class SoftwareBase(BaseModel):
    version: str
    commit_hash: str
    path: str
    kind: int


class SoftwareCreate(SoftwareBase):
    pass


class SoftwareResponse(SoftwareBase):
    id: int

    class Config:
        orm_mode = True


# Task Schemas
class TaskBase(BaseModel):
    name: str


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int

    class Config:
        orm_mode = True


# Kind Schemas
class KindBase(BaseModel):
    name: str


class KindCreate(KindBase):
    pass


class KindResponse(KindBase):
    id: int

    class Config:
        orm_mode = True


# Log Schemas
class LogBase(BaseModel):
    path: str
    md5_sum: str
    instance_id: int


class LogCreate(LogBase):
    pass


class LogResponse(LogBase):
    id: int

    class Config:
        orm_mode = True


# Instance Schemas
class InstanceBase(BaseModel):
    manufacture_number: int
    schedule_interval: Optional[int] = 300
    last_ping: Optional[datetime] = None
    kind: KindResponse
    task: TaskResponse
    sw: SoftwareResponse


class InstanceCreate(InstanceBase):
    pass


class InstanceCheckRequest(BaseModel):
    log_path: str
    md5: str


class InstanceCheckResponse(BaseModel):
    result: bool


class InstanceResponse(InstanceBase):
    id: int
    logs: List[LogResponse] = []  # Include logs as a list of LogResponse objects

    class Config:
        orm_mode = True

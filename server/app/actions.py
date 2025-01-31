from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session
from . import models, schemas


async def get_user(db: Session, user_id: int):
    res = await db.query(models.User).filter(models.User.id == user_id).first()
    return res


async def get_users(db: Session, skip: int = 0, limit: int = 10):
    res = await db.query(models.User).offset(skip).limit(limit).all()
    return res


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def delete_user(db: Session, user_id: int):
    db_user = await db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


def get_instance(db: Session, instance_id: int):
    return db.query(models.Instance).filter(models.Instance.id == instance_id).first()


def get_instances(db: Session, skip: int = 0, limit: int = None):
    return db.query(models.Instance).offset(skip).limit(limit).all()


def create_instance(db: Session, instance: schemas.InstanceCreate):
    db_instance = models.Instance(
        manufacture_number=instance.manufacture_number,
        schedule_interval=instance.schedule_interval,
        last_ping=instance.last_ping,
        username=instance.username,
        pwd_salt=instance.pwd_salt,
        kind_id=instance.kind_id if instance.kind_id is not None else None,
        task_id=instance.task_id if instance.task_id is not None else None,
        sw_id=instance.sw_id if instance.sw_id is not None else None,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def delete_instance(db: Session, instance_id: int):
    db_instance = db.query(models.Instance).filter(models.Instance.id == instance_id).first()
    if db_instance:
        db.delete(db_instance)
        db.commit()
    return db_instance

def update_instance(db: Session, instance_id: int, update_data: dict):
    db_instance = db.query(models.Instance).filter(models.Instance.id == instance_id).first()
    if not db_instance:
        return None

    for key, value in update_data.items():
        if value is None:
            continue  
        if key == 'kind' and isinstance(value, dict):  
            db_instance.kind_id = value.get('id') 
        elif key == 'task' and isinstance(value, dict):  
            db_instance.task_id = value.get('id')
        elif key == 'sw' and isinstance(value, dict):  
            db_instance.sw_id = value.get('id')
        else:
            setattr(db_instance, key, value)

    db.commit()
    db.refresh(db_instance)
    return db_instance



def get_log(db: Session, log_id: int):
    return db.query(models.Log).filter(models.Log.id == log_id).first()


def get_logs_by_instance(db: Session, instance_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Log).filter(models.Log.instance_id == instance_id).offset(skip).limit(limit).all()


def should_upload_log(db: Session, instance_id: int, log_data: schemas.InstanceCheckRequest):
    instance = db.query(models.Instance).filter(models.Instance.id == instance_id).first()
    instance.last_ping = datetime.now()
    found_log = db.query(models.Log).filter(models.Log.path == log_data.log_path).first()
    res = False
    if not found_log:
        res = True
    elif found_log.md5_sum != log_data.md5:
        db.delete(found_log)
        res = True
    db.commit()
    return res


def create_log(db: Session, log: schemas.LogCreate):
    db_log = models.Log(
        path=log.path,
        md5_sum=log.md5_sum,
        instance_id=log.instance_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def delete_log(db: Session, log_id: int):
    db_log = db.query(models.Log).filter(models.Log.id == log_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log

def get_instance_kinds(db: Session):
    return db.query(models.Kind).distinct().all()

def get_instance_tasks(db: Session):
    return db.query(models.Task).distinct().all()

def get_instance_software(db: Session):
    return db.query(models.Software).distinct().all()



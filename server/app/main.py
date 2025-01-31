import os

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import hashlib
import traceback
from fastapi.responses import JSONResponse

from . import actions, models, schemas
from .database import SessionLocal, engine

from fastapi.middleware.cors import CORSMiddleware

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3001",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# actions Endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return actions.create_user(db=db, user=user)


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = actions.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = actions.get_users(db, skip=skip, limit=limit)
    return users


@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = actions.delete_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/instances/", response_model=schemas.InstanceResponse)
def create_instance(instance: schemas.InstanceCreate, db: Session = Depends(get_db)):
    return actions.create_instance(db=db, instance=instance)


@app.post("/instances/{instance_id}/check")
def check_logs(instance_id: int, log_data: schemas.InstanceCheckRequest, db: Session = Depends(get_db)):
    res = actions.should_upload_log(db=db, instance_id=instance_id, log_data=log_data)
    return JSONResponse({'result': res})


@app.get("/instances/{instance_id}", response_model=schemas.InstanceResponse)
def read_instance(instance_id: int, db: Session = Depends(get_db)):
    db_instance = actions.get_instance(db, instance_id=instance_id)
    if db_instance is None:
        raise HTTPException(status_code=404, detail="Instance not found")
    return db_instance


@app.get("/instances/", response_model=list[schemas.InstanceResponse])
def read_instances(skip: int = 0, limit: int = None, db: Session = Depends(get_db)):
    return actions.get_instances(db, skip=skip, limit=limit)


@app.delete("/instances/{instance_id}", response_model=schemas.InstanceResponse)
def delete_instance(instance_id: int, db: Session = Depends(get_db)):
    db_instance = actions.delete_instance(db, instance_id=instance_id)
    if db_instance is None:
        raise HTTPException(status_code=404, detail="Instance not found")
    return db_instance

@app.put("/instances/{instance_id}", response_model=schemas.InstanceResponse)
def update_instance(instance_id: int, instance: schemas.InstanceUpdate, db: Session = Depends(get_db)):
    db_instance = actions.update_instance(db, instance_id=instance_id, update_data=instance.model_dump(exclude_unset=True))
    if db_instance is None:
        raise HTTPException(status_code=404, detail="Instance not found")
    return db_instance


# Log Endpoints
@app.post("/logs/", response_model=schemas.LogResponse)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    return actions.create_log(db=db, log=log)


# Log Endpoints
@app.post("/logs/upload")
def create_log(incoming_file: UploadFile = File(...)):
    try:
        contents = incoming_file.file.read()
        md5 = hashlib.md5(contents).hexdigest()
        with open(f'server/app/data/{md5}', 'wb') as f:
            f.write(contents)
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail='Something went wrong')
    finally:
        incoming_file.file.close()

    return {"message": f"Successfully uploaded {incoming_file.filename}"}


@app.get("/logs/{log_id}", response_model=schemas.LogResponse)
def read_log(log_id: int, db: Session = Depends(get_db)):
    db_log = actions.get_log(db, log_id=log_id)
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return db_log


@app.get("/instances/{instance_id}/logs", response_model=list[schemas.LogResponse])
def read_logs_by_instance(instance_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return actions.get_logs_by_instance(db, instance_id=instance_id, skip=skip, limit=limit)


@app.delete("/logs/{log_id}", response_model=schemas.LogResponse)
def delete_log(log_id: int, db: Session = Depends(get_db)):
    db_log = actions.delete_log(db, log_id=log_id)
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return db_log


@app.get("/kinds/", response_model=list[schemas.KindResponse])
def get_instance_kinds(db: Session = Depends(get_db)):
    kinds = actions.get_instance_kinds(db)
    return kinds

@app.get("/tasks/", response_model=list[schemas.TaskResponse])
def get_instance_tasks(db: Session = Depends(get_db)):
    tasks = actions.get_instance_tasks(db)
    return tasks

@app.get("/software/", response_model=list[schemas.SoftwareResponse])
def get_instance_software(db: Session = Depends(get_db)):
    software_list = actions.get_instance_software(db)
    return software_list


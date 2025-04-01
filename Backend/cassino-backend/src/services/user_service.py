from sqlalchemy.orm import Session
from src.models.user import User
#from passlib.context import CryptContext

#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, id: str, balance: int):
 #   hashed_password = pwd_context.hash(password)
    new_user = User(username=username, id=id,balance=balance)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

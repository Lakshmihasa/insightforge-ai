from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from src.database.session import get_db
from src.models.user import User

from src.auth.dependencies import get_current_user
from src.auth.roles import admin_required

from src.schemas.user_response import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_profile(
    current_user=Depends(get_current_user)
):
    return current_user


@router.get("/", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    users = db.query(User).all()

    return users
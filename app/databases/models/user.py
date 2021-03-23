from flask_login import UserMixin
from app.databases.db_sql import db_sql
from werkzeug.security import check_password_hash
from app.managers import login_manager


class User(db_sql.Model, UserMixin):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    username = db_sql.Column(db_sql.String(32), nullable=False, unique=True)
    password = db_sql.Column(db_sql.String(95), nullable=False)
    nama = db_sql.Column(db_sql.String(32), nullable=False)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'nama': self.nama
        }


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

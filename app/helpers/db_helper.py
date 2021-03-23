from werkzeug.security import generate_password_hash
from app.databases.db_sql import db_sql


def add(data):
    try:
        db_sql.session.add(data)
        db_sql.session.commit()
        return True
    except Exception as e:
        print(e)
        db_sql.session.rollback()
        db_sql.session.flush()
        return False


def update():
    try:
        db_sql.session.commit()
        return True
    except Exception as e:
        print(e)
        db_sql.session.rollback()
        db_sql.session.flush()
        return False


def delete(cls, pk):
    try:
        item = cls.query.get(pk)
        db_sql.session.delete(item)
        db_sql.session.commit()
        return True
    except Exception as e:
        print(e)
        db_sql.session.rollback()
        db_sql.session.flush()
        return False


def hash_password(password):
    h_password = generate_password_hash(password)
    return h_password

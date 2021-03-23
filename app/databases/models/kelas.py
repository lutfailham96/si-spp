from app.databases.db_sql import db_sql
from app.databases.models.siswa import Siswa


class Kelas(db_sql.Model):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    kelas = db_sql.Column(db_sql.String(32), nullable=False, unique=True)
    siswas = db_sql.relationship('Siswa', backref='kelas', lazy=True)

    def to_dict(self, index):
        female = Siswa.query.filter((Siswa.id_kelas == self.id) & (Siswa.jenis_kelamin == 1)).count()
        male = Siswa.query.filter((Siswa.id_kelas == self.id) & (Siswa.jenis_kelamin == 0)).count()
        return {
            'id': self.id,
            'index': index + 1,
            'kelas': self.kelas,
            'laki': male,
            'perempuan': female
        }

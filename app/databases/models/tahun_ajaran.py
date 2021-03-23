from app.databases.db_sql import db_sql


class TahunAjaran(db_sql.Model):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    tahun_ajaran = db_sql.Column(db_sql.String(32), nullable=False, unique=True)
    siswas = db_sql.relationship('Siswa', backref='tahun_ajaran', lazy=True)

    def to_table(self, idx):
        return {
            'id': self.id,
            'index': idx + 1,
            'tahun_ajaran': self.tahun_ajaran,
            'siswa': len(self.siswas)
        }

    def to_dict(self):
        return {
            'id': self.id,
            'tahun_ajaran': self.tahun_ajaran
        }

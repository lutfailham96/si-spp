from app.databases.db_sql import db_sql


class Sekolah(db_sql.Model):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    nama_sekolah = db_sql.Column(db_sql.String(32), nullable=False)
    alamat_sekolah = db_sql.Column(db_sql.String(32), nullable=False)
    kepala_sekolah = db_sql.Column(db_sql.String(32), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nama_sekolah': self.nama_sekolah,
            'alamat_sekolah': self.alamat_sekolah,
            'kepala_sekolah': self.kepala_sekolah
        }

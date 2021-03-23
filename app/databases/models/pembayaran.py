from app.databases.db_sql import db_sql
import datetime


class Pembayaran(db_sql.Model):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    uuid = db_sql.Column(db_sql.String(), nullable=False, unique=True)
    tahun = db_sql.Column(db_sql.Integer(), nullable=False)
    bulan = db_sql.Column(db_sql.Integer(), nullable=False)
    nis_siswa = db_sql.Column(db_sql.String(32), nullable=False)
    nama_siswa = db_sql.Column(db_sql.String(32), nullable=False)
    jenis_siswa = db_sql.Column(db_sql.Integer(), nullable=False)
    tgl_pembayaran = db_sql.Column(db_sql.Date(), nullable=False, default=datetime.datetime.utcnow())
    nominal = db_sql.Column(db_sql.Integer(), nullable=False)
    status = db_sql.Column(db_sql.Boolean(), nullable=False)  # false: tepat, true: tunggakan

    def to_table(self, index):
        return {
            'id': self.id,
            'index': index + 1,
            'uuid': self.uuid,
            'tahun': self.tahun,
            'bulan': self.bulan,
            'nis_siswa': self.nis_siswa,
            'nama_siswa': self.nama_siswa,
            'jenis_siswa': self.jenis_siswa,
            'tgl_pembayaran': str(self.tgl_pembayaran),
            'nominal': self.nominal,
            'status': self.status
        }

    def to_dict(self, kelas):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'tahun': self.tahun,
            'bulan': self.bulan,
            'nis_siswa': self.nis_siswa,
            'nama_siswa': self.nama_siswa,
            'jenis_siswa': self.jenis_siswa,
            'tgl_pembayaran': str(self.tgl_pembayaran),
            'nominal': self.nominal,
            'status': self.status,
            'kelas': kelas
        }

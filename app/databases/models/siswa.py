from app.databases.db_sql import db_sql


class Siswa(db_sql.Model):
    id = db_sql.Column(db_sql.Integer(), primary_key=True)
    nis_siswa = db_sql.Column(db_sql.String(32), nullable=False, unique=True)
    nama_siswa = db_sql.Column(db_sql.String(32), nullable=False)
    jenis_kelamin = db_sql.Column(db_sql.Integer(), nullable=False)  # 0: laki-laki, 1: perempuan
    alamat_siswa = db_sql.Column(db_sql.String(128), nullable=False)
    agama = db_sql.Column(db_sql.String(32), nullable=False)
    jenis_siswa = db_sql.Column(db_sql.Integer(), nullable=False)  # 0: reguler, 1: beasiswa
    id_tahun_ajaran = db_sql.Column(db_sql.Integer(), db_sql.ForeignKey('tahun_ajaran.id'), nullable=False)
    id_kelas = db_sql.Column(db_sql.Integer(), db_sql.ForeignKey('kelas.id'), nullable=False)
    # id_tahun_ajaran = db_sql.Column(db_sql.Integer(), nullable=False)
    # id_kelas = db_sql.Column(db_sql.Integer(), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nis': self.nis_siswa,
            'nama': self.nama_siswa,
            'jenis_kelamin': self.jenis_kelamin,
            'alamat': self.alamat_siswa,
            'agama': self.agama,
            'id_tahun_ajaran': self.id_tahun_ajaran,
            'id_kelas': self.id_kelas,
            'jenis_siswa': self.jenis_siswa
        }

    def to_table(self, index, kelas, tahun_ajaran):
        return {
            'id': self.id,
            'index': index + 1,
            'nis': self.nis_siswa,
            'nama': self.nama_siswa,
            'jenis_kelamin': self.jenis_kelamin,
            'alamat': self.alamat_siswa,
            'agama': self.agama,
            'id_tahun_ajaran': self.id_tahun_ajaran,
            'id_kelas': self.id_kelas,
            'tahun_ajaran': tahun_ajaran,
            'kelas': kelas,
            'jenis_siswa': self.jenis_siswa
        }

import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, abort
from flask_login import login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash
from config import Config
from app.databases import init_databases
from app.databases.models.siswa import Siswa
from app.databases.models.user import User
from app.databases.models.kelas import Kelas
from app.databases.models.tahun_ajaran import TahunAjaran
from app.databases.models.sekolah import Sekolah
from app.databases.models.pembayaran import Pembayaran
from app.managers import init_managers
from app.helpers.db_helper import add, update, delete
from random import randint
import numpy as np

app = Flask(__name__)
app.config.from_object(Config)
# jinja strip & trim code blocks
app.jinja_env.lstrip_blocks = True
app.jinja_env.trim_blocks = True
# init managers and databases
init_databases(app)
init_managers(app)


def rp_hash(person):
    r_hash = 5381
    value = person.upper()
    for char in value:
        r_hash = ((np.left_shift(r_hash, 5) + r_hash) + ord(char))
    return np.int32(r_hash)


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


def success_w(**kwargs):
    return {
        'status': 'OK',
        **kwargs
    }


@app.route('/')
def index():
    return redirect(url_for('dashboard'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        url_next = request.args.get('next')
        username = request.form.get('username')
        password = request.form.get('password')
        real_person = request.form.get('realPerson')
        real_person_hash = request.form.get('realPersonHash')
        if rp_hash(real_person) != int(real_person_hash):
            flash('Captcha salah', 'errors')
            return render_template('login.html')
        user = User.query.filter(User.username == username).first()
        if user is not None and user.check_password(password):
            login_user(user)
            return redirect(url_next or url_for('dashboard'))
        flash('Kombinasi username & password salah', 'errors')
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Anda berhasil logout', 'success')
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    classes = Kelas.query.count()
    students = Siswa.query.count()
    f_students = Siswa.query.filter(Siswa.jenis_kelamin == 1).count()
    m_students = Siswa.query.filter(Siswa.jenis_kelamin == 0).count()
    total_transaction = 0
    transactions = Pembayaran.query.filter(Pembayaran.jenis_siswa == 0).all()
    for transaction in transactions:
        total_transaction += transaction.nominal
    school = Sekolah.query.get(1)
    school_arr = school.alamat_sekolah.split(',')
    address = '{}, {}'.format(school_arr[0], school_arr[1])
    city = school_arr[2]
    province = school_arr[3]
    data = {
        'student': {
            'total': students,
            'male': m_students,
            'female': f_students
        },
        'class': classes,
        'school': {
            'name': school.nama_sekolah,
            'address': address,
            'city': city,
            'province': province,
            'school_head': school.kepala_sekolah
        },
        'transactions': total_transaction
    }
    return render_template('dashboard.html', data=data)


@app.route('/tahun-ajaran')
@login_required
def tahun_ajaran():
    return render_template('tahun_ajaran.html')


@app.route('/kelas')
@login_required
def kelas():
    return render_template('kelas.html')


@app.route('/pembayaran')
@login_required
def pembayaran():
    return render_template('pembayaran.html')


@app.route('/laporan')
@login_required
def laporan():
    return render_template('laporan.html')


@app.route('/siswa')
@login_required
def siswa():
    classes = Kelas.query.order_by(Kelas.id.asc()).all()
    return render_template('siswa.html', classes=classes)


@app.route('/pengaturan')
@login_required
def setting():
    school = Sekolah.query.get(1)
    return render_template('pengaturan.html', data=school)


@app.route('/ajax/sekolah', methods=['PUT'])
@login_required
def ajax_school():
    school = Sekolah.query.get(1)
    json = request.get_json()
    school.nama_sekolah = json['nama_sekolah']
    school.alamat_sekolah = json['alamat_sekolah']
    school.kepala_sekolah = json['kepala_sekolah']
    if update():
        return success_w()
    else:
        abort(422)


@app.route('/profil', methods=['GET', 'PUT'])
@login_required
def profile():
    if request.method == 'PUT':
        json = request.get_json()
        username = current_user.username
        password = json['password']
        name = json['name']
        app.logger.info(json)
        user = User.query.filter(User.username == username).first()
        if user is None or not user.check_password(password):
            abort(404)
        user.nama = name
        if update():
            return success_w()
        else:
            abort(422)
    return render_template('profile.html')


@app.route('/change-password', methods=['PUT'])
@login_required
def change_password():
    user = User.query.filter(User.username == current_user.username).first_or_404()
    json = request.get_json()
    password = json['password_confirmation']
    user.password = generate_password_hash(password)
    if update():
        return success_w()
    else:
        abort(422)


@app.route('/ajax/kelas')
@login_required
def ajax_class():
    classes = Kelas.query.order_by(Kelas.id.asc()).all()
    return success_w(
        data=[c.to_dict(idx) for idx, c in enumerate(classes)]
    )


@app.route('/ajax/tahun-ajaran', methods=['GET', 'POST'])
@login_required
def ajax_school_year():
    if request.method == 'POST':
        json = request.get_json()
        school_year = json['tahun_ajaran']
        data = TahunAjaran(
            tahun_ajaran=school_year
        )
        if add(data):
            return success_w()
        else:
            abort(422)

    items = TahunAjaran.query.order_by(TahunAjaran.tahun_ajaran.asc()).all()
    return success_w(
        data=[i.to_table(idx) for idx, i in enumerate(items)]
    )


@app.route('/ajax/tahun-ajaran/<id_ajaran>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def ajax_school_year_id(id_ajaran):
    if request.method == 'DELETE':
        if delete(TahunAjaran, id_ajaran):
            return success_w()
        else:
            abort(500)
    item = TahunAjaran.query.filter(TahunAjaran.id == int(id_ajaran)).first()
    if request.method == 'PUT':
        json = request.get_json()
        school_year = json['tahun_ajaran']
        item.tahun_ajaran = school_year
        if update():
            return success_w()
        else:
            abort(422)
    return success_w(
        data=item.to_dict()
    )


@app.route('/ajax/siswa', methods=['GET', 'POST'])
@login_required
def ajax_student():
    if request.method == 'POST':
        json = request.get_json()
        nis = json['nis']
        name = json['nama']
        gender = json['jenis_kelamin']
        d_class = json['kelas']
        school_year = json['tahun_ajaran']
        religion = json['agama']
        student_type = json['jenis_siswa']
        address = json['alamat']
        student = Siswa(
            nis_siswa=nis,
            nama_siswa=name,
            jenis_kelamin=gender,
            id_kelas=int(d_class),
            id_tahun_ajaran=int(school_year),
            agama=religion,
            jenis_siswa=student_type,
            alamat_siswa=address
        )
        if add(student):
            return success_w()
        else:
            abort(422)
    d_class = request.args.get('kelas')
    # student = []
    if d_class == '':
        students = Siswa.query.join(Kelas, Siswa.id_kelas == Kelas.id) \
            .join(TahunAjaran, Siswa.id_tahun_ajaran == TahunAjaran.id) \
            .add_columns(Kelas.kelas, TahunAjaran.tahun_ajaran) \
            .order_by(Siswa.id_kelas).all()
    else:
        students = Siswa.query.join(Kelas, Siswa.id_kelas == Kelas.id) \
            .join(TahunAjaran, Siswa.id_tahun_ajaran == TahunAjaran.id) \
            .add_columns(Kelas.kelas, TahunAjaran.tahun_ajaran) \
            .filter(Siswa.id_kelas == d_class) \
            .order_by(Siswa.id_kelas).all()
    return {
        'status': 'OK',
        'data': [s[0].to_table(idx, s[1], s[2]) for idx, s in enumerate(students)]
    }


@app.route('/ajax/siswa/<id_student>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def ajax_student_id(id_student):
    if request.method == 'DELETE':
        if delete(Siswa, id_student):
            return success_w()
        else:
            abort(500)
    if request.method == 'PUT':
        item = Siswa.query.filter(Siswa.id == id_student).first_or_404()
        json = request.get_json()
        name = json['nama']
        gender = json['jenis_kelamin']
        d_class = json['kelas']
        school_year = json['tahun_ajaran']
        religion = json['agama']
        student_type = json['jenis_siswa']
        address = json['alamat']
        item.nama_siswa = name
        item.jenis_kelamin = int(gender)
        item.alamat_siswa = address
        item.agama = religion
        item.jenis_siswa = int(student_type)
        item.id_tahun_ajaran = int(school_year)
        item.id_kelas = int(d_class)
        if update():
            return success_w()
        else:
            abort(422)
    item = Siswa.query.join(Kelas, Siswa.id_kelas == Kelas.id) \
        .join(TahunAjaran, Siswa.id_tahun_ajaran == TahunAjaran.id) \
        .add_columns(Kelas.kelas, TahunAjaran.tahun_ajaran) \
        .filter(Siswa.id == id_student).first_or_404()
    return success_w(
        data=item[0].to_table(1, item[1], item[2])
    )


@app.route('/ajax/pembayaran', methods=['GET', 'POST'])
@login_required
def ajax_transaction():
    if request.method == 'POST':
        json = request.get_json()
        nis = json['nis']
        student = Siswa.query.filter(Siswa.nis_siswa == nis).first()
        month = int(json['bulan'])
        year = int(json['tahun'])
        m_now = datetime.datetime.now().month - 1
        payment = 100000
        nominal = payment + 10000 if m_now > month else payment
        status = True if m_now > month else False
        if student.jenis_siswa == 1:
            nominal = 0
            status = False
        transaction = Pembayaran(
            uuid=str(randint(100000, 999999)),
            tahun=year,
            bulan=month,
            nis_siswa=nis,
            nama_siswa=student.nama_siswa,
            jenis_siswa=student.jenis_siswa,
            nominal=nominal,
            status=status)
        if add(transaction):
            return success_w()
        else:
            abort(422)
    nis = request.args.get('nis') if request.args.get('nis') else None
    # year = int(request.args.get('tahun')) if request.args.get('tahun') else None
    y_now = datetime.datetime.now().year
    items = Pembayaran.query.filter((Pembayaran.nis_siswa == nis) & (Pembayaran.tahun == y_now)) \
        .order_by(Pembayaran.bulan.asc()).all()
    return success_w(
        data=[d.to_table(idx) for idx, d in enumerate(items)]
    )


@app.route('/ajax/pembayaran/<uuid>')
@login_required
def ajax_pembayaran_uuid(uuid):
    item = Pembayaran.query.filter(Pembayaran.uuid == uuid).first_or_404()
    student = Siswa.query.join(Kelas, Siswa.id_kelas == Kelas.id).add_column(Kelas.kelas) \
        .filter(Siswa.nis_siswa == item.nis_siswa).first()
    print(student)
    return success_w(
        data=item.to_dict(student[1])
    )


@app.route('/ajax/laporan')
@login_required
def ajax_report():
    tunggakan_data = []
    tepat_data = []
    last_data = Pembayaran.query.order_by(Pembayaran.bulan.desc()).first()
    # m_now = datetime.datetime.now().month - 1
    for i in range(last_data.bulan + 1):
        tunggakan_data.append(Pembayaran.query.filter(
            (Pembayaran.status == 1) &
            (Pembayaran.bulan == i) &
            (Pembayaran.jenis_siswa == 0)).count())
        tepat_data.append(Pembayaran.query.filter(
            (Pembayaran.status == 0) &
            (Pembayaran.bulan == i) &
            (Pembayaran.jenis_siswa == 0)).count())
    tunggakan = Pembayaran.query.filter(Pembayaran.status == 1).count()
    tepat = Pembayaran.query.filter(Pembayaran.status == 0).count()
    return success_w(
        data={
            'tepat': tepat,
            'tunggakan': tunggakan,
            'tunggakan_data': tunggakan_data,
            'tepat_data': tepat_data
        }
    )


@app.route('/ajax/laporan2')
@login_required
def ajax_report_2():
    items = Pembayaran.query.order_by(Pembayaran.tahun.asc()).all()
    return success_w(
        data=[d.to_table(idx) for idx, d in enumerate(items)]
    )

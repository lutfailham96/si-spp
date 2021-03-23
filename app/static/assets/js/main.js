$(document).ready(function () {
    /* VARS */
    let inputValid = false
    let editedIndex = -1
    const addSchoolYear = $('#add-school-year')
    const titleSchoolYear = $('#title-school-year')
    const titleStudent = $('#title-student')
    const modalStudent = $('#modal-student')
    const modalSchoolYear = $('#modal-school-year')
    const formSchoolYear = $('#form-school-year')
    const formProfile = $('#form-profile')
    const formStudent = $('#form-student')
    const formSchool = $('#form-school')
    const addStudent = $('#add-student')
    const btnChangePassword = $('#change-password')
    const modalChangePassword = $('#modal-change-password')
    const formChangePassword = $('#form-change-password')
    let transaction = {
        student: {
            nis: '',
            bulan: 0,
            tahun: 0,
            jenis: 0
        },
        months: [
            { text: 'Januari', status: false },
            { text: 'Februari', status: false },
            { text: 'Maret', status: false },
            { text: 'April', status: false },
            { text: 'Mei', status: false },
            { text: 'Juni', status: false },
            { text: 'Juli', status: false },
            { text: 'Agustus', status: false },
            { text: 'September', status: false },
            { text: 'Oktober', status: false },
            { text: 'November', status: false },
            { text: 'Desember', status: false },
        ]
    }
    const formTransaction = $('#form-transaction')
    const transactionYear = $('#transaction-year')
    const filterClass = $('#filter-class')
    const filterStudent = $('#filter-student')
    $('#table-class').on( 'init.dt', function () {
        $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-default')
    }).DataTable({
        ajax: '/ajax/kelas',
        columns: [
            { data: 'index' },
            { data: 'kelas' },
            {
                data: null,
                render: function (data) {
                    const total = data.laki + data.perempuan
                    if (total === 0) {
                        return 'Belum ada'
                    } else return total
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.laki === 0) return 'Belum ada'
                    else return data.laki
                }
            },
            {
                data: null,
                render (data) {
                    if (data.perempuan === 0) return 'Belum ada'
                    else return data.perempuan
                }
            }
        ],
        lengthChange: !1,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4 ]
                }
            },
        ],
        language: {
            paginate: {
                previous: "<i class='fas fa-angle-left'>",
                next: "<i class='fas fa-angle-right'>"
            }
        }
    })
    const tableSchoolYear = $('#table-school-year').on( 'init.dt', function () {
        $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-default')
    }).DataTable({
        ajax: '/ajax/tahun-ajaran',
        columns: [
            { data: 'index' },
            { data: 'tahun_ajaran' },
            {
                data: null,
                render (data) {
                    if (data.siswa === 0) {
                        return 'Belum ada'
                    } else return data.siswa
                }
            },
            {
                data: null,
                render: function (data) {
                    return '<div class="btn-group-sm">' +
                                '<button type="button" class="btn btn-primary btn-icon-only edit-item" data-id="' + data.id + '"><span class="btn-inner--icon"><i class="fas fa-edit"></i></span></button>' +
                                '<button type="button" class="btn btn-danger btn-icon-only delete-item" data-id="' + data.id + '"><span class="btn-inner--icon"> <i class="fas fa-trash-alt"></i> </span> </button>' +
                            '</div>'
                }
            }
        ],
        lengthChange: !1,
        dom: 'Bfrtip',
        buttons: ['print'],
        language: {
            paginate: {
                previous: "<i class='fas fa-angle-left'>",
                next: "<i class='fas fa-angle-right'>"
            }
        }
    })
    const tableStudent = $('#table-student').on( 'init.dt', function () {
        $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-default')
    }).DataTable({
        ajax: '/ajax/siswa?kelas=',
        columns: [
            { data: 'index' },
            { data: 'nis' },
            { data: 'nama' },
            {
                data: null,
                render: function (data) {
                    if (data.jenis_kelamin === 0) {
                        return '<label class="text-primary">Laki-Laki</label>'
                    } else {
                        return '<label class="text-pink">Perempuan</label>'
                    }
                }
            },
            { data: 'kelas' },
            { data: 'tahun_ajaran' },
            { data: 'agama' },
            {
                data: null,
                render: function (data) {
                    if (data.jenis_siswa === 0) {
                        return '<label class="badge badge-default">Reguler</label>'
                    } else {
                        return '<label class="badge badge-success">Beasiswa</label>'
                    }
                }
            },
            { data: 'alamat' },
            {
                data: null,
                render: function (data) {
                    return '<div class="btn-group-sm">' +
                        '<button type="button" class="btn btn-primary btn-icon-only edit-item" data-id="' + data.id + '"><span class="btn-inner--icon"><i class="fas fa-edit"></i></span></button>' +
                        '<button type="button" class="btn btn-danger btn-icon-only delete-item" data-id="' + data.id + '"><span class="btn-inner--icon"> <i class="fas fa-trash-alt"></i> </span> </button>' +
                        '</div>'
                }
            }
        ],
        lengthChange: !1,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
                }
            },
        ],
        language: {
            paginate: {
                previous: "<i class='fas fa-angle-left'>",
                next: "<i class='fas fa-angle-right'>"
            }
        }
    })
    const tableTransaction = $('#table-transaction').on( 'init.dt', function () {
        $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-default')
    }).DataTable({
        ajax: '/ajax/pembayaran',
        columns: [
            { data: 'index' },
            { data: 'nis_siswa' },
            { data: 'nama_siswa' },
            {
                data: null,
                render: function (data) {
                    if (data.jenis_siswa === 0) {
                        return '<label class="badge badge-default">Reguler</label>'
                    } else {
                        return '<label class="badge badge-success">Beasiswa</label>'
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.nominal > 0)
                        return formatRupiah(data.nominal.toString(), 'Rp. ')
                    else
                        return '<label class="badge badge-warning">Beasiswa Gratis</label>'
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.status === false) {
                        return '<label class="badge badge-success">Tepat Waktu</label>'
                    } else {
                        return '<label class="badge badge-danger">Tunggakan</label>'
                    }
                }
            },
            { data: 'tahun' },
            {
                data: null,
                render: function (data) {
                    return transaction.months[data.bulan].text
                }
            },
            {
                data: null,
                render: function (data) {
                    return '<button class="btn btn-warning btn-sm btn-icon-only print-item" data-id="' + data.uuid + '"><span class="btn-inner--icon"><i class="fa fa-print"></i></span></button>'
                }
            },
        ],
        lengthChange: !1,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'print',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
                }
            },
        ],
        language: {
            paginate: {
                previous: "<i class='fas fa-angle-left'>",
                next: "<i class='fas fa-angle-right'>"
            }
        }
    })
    $('#table-report').on( 'init.dt', function () {
        $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-default')
    }).DataTable({
        ajax: '/ajax/laporan2',
        columns: [
            { data: 'index' },
            { data: 'uuid' },
            { data: 'nis_siswa' },
            { data: 'nama_siswa' },
            { data: 'tahun' },
            {
                data: null,
                render: (data) => {
                    return transaction.months[data.bulan].text
                }
            },
            {
                data: null,
                render: (data) => {
                    return formatRupiah(data.nominal.toString(), 'Rp. ')
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.status === false) {
                        return '<label class="badge badge-success">Tepat Waktu</label>'
                    } else {
                        return '<label class="badge badge-danger">Tunggakan</label>'
                    }
                }
            },
        ],
        lengthChange: !1,
        dom: 'Bfrtip',
        buttons: ['print'],
        language: {
            paginate: {
                previous: "<i class='fas fa-angle-left'>",
                next: "<i class='fas fa-angle-right'>"
            }
        }
    })

    /* TRANSACTION */
    transactionYear.on('change', function () {
        resetMonths()
        refreshTransaction()
        generatePayment(transaction.student.jenis)
    })
    formTransaction.on('submit', function (e) {
        e.preventDefault()
        transaction.student.bulan = $('#transaction-month').val()
        transaction.student.tahun = transactionYear.val()
        swal({
            title: 'Apa anda yakin?',
            text: "Data pembayaran tidak dapat diubah!",
            type: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-info',
            confirmButtonText: 'Ya',
            cancelButtonClass: 'btn btn-secondary',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then(result => {
            if (result.value) {
                axios.post('/ajax/pembayaran', transaction.student).then(response => {
                    if (response.data.status === 'OK') {
                        refreshTransaction()
                        successAlert('Pembayaran berhasil disimpan')
                    } else unsavedAlert()
                }).catch(() => unsavedAlert())
            }
        })
    })
    tableTransaction.on('click', '.print-item', function () {
        const transactionId = $(this).data('id')
        axios.get('/ajax/pembayaran/' + transactionId).then(response => {
            if (response.data.status === 'OK') {
                const printStatus = $('#print-status')
                const body = $('body')
                const bodyAll = $('body *')
                const printNominal = $('#print-nominal')
                $('#print-name').html(response.data.data.nama_siswa)
                $('#print-nis').html(response.data.data.nis_siswa)
                $('#print-uuid').html(response.data.data.uuid)
                $('#print-month').html(transaction.months[response.data.data.bulan].text)
                $('#print-year').html(response.data.data.tahun)
                if (response.data.data.nominal > 0)
                    printNominal.html(formatRupiah(response.data.data.nominal.toString(), 'Rp. '))
                else
                    printNominal.html('BEASISWA GRATIS')
                $('#print-class').html(response.data.data.kelas)
                if (response.data.data.status === false) {
                    printStatus.html('Tepat Waktu')
                } else {
                    printStatus.html('Tunggakan')
                }
                body.css('visibility', 'hidden')
                bodyAll.css('visibility', 'hidden')
                $('#printable').css('visibility', 'visible')
                $('#printable *').css('visibility', 'visible')
                window.print()
                body.css('visibility', 'visible')
                bodyAll.css('visibility', 'visible')
            }
        })
    })
    function initTransaction () {
        filterStudent.select2()
        fetchStudents().then(response => {
            let html = ''
            $.each(response.data.data, function (index, data) {
                html += '<option value="' + data.id + '">' + data.nama + ' (' + data.nis + ')' + '</option>'
            })
            filterStudent.html(html)
            showStudent()
        })
        const date = new Date()
        const year = date.getFullYear()
        transactionYear.val(year)
    }
    function refreshTransaction() {
        tableTransaction.ajax.url('/ajax/pembayaran?nis=' + transaction.student.nis).load(function () {
            const date = new Date()
            const year = date.getFullYear()
            if (parseInt(transactionYear.val()) >= year) {
                tableTransaction.rows().every(function () {
                    transaction.months[parseInt(this.data().bulan)].status = true
                })
            }
            fetchMonths()
        }, false)
    }
    function fetchMonths() {
        const transactionMonth = $('#transaction-month')
        let html = ''
        $.each(transaction.months, function (index, data) {
            if (data.status === false) {
                html += '<option value="' + index + '">' + data.text + '</option>'
            } else {
                html += '<option value="' + index + '" disabled>' + data.text + '</option>'
            }
        })
        transactionMonth.html(html)
        $('#form-transaction button').prop('disabled', false)
        generatePayment(transaction.student.jenis)
    }
    function resetMonths() {
        $.each(transaction.months, function (index) {
            transaction.months[index].status = false
        })
    }

    /* REPORT */
    function initReport() {
        const data = {
            tepat: 0,
            tunggakan: 0,
            tunggakanData: [],
            tepatData: []
        }

        axios.get('/ajax/laporan').then(response => {
            if (response.data.status === 'OK') {
                data.tepat = response.data.data.tepat
                data.tunggakan = response.data.data.tunggakan
                data.tepatData = response.data.data.tepat_data
                data.tunggakanData = response.data.data.tunggakan_data
                new Chart($('#chart-transaction-annual'), {
                    type: 'line',
                    options: {
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    color: Charts.colors.gray[200],
                                    zeroLineColor: Charts.colors.gray[200]
                                },
                                ticks: {

                                }
                            }]
                        }
                    },
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                        datasets: [
                            {
                                label: 'Tunggakan',
                                fill: false,
                                data: data.tunggakanData,
                                backgroundColor: Charts.colors.theme['danger'],
                                borderColor: Charts.colors.theme['danger']
                            },
                            {
                                label: 'Tepat Waktu',
                                fill: false,
                                data: data.tepatData,
                                backgroundColor: Charts.colors.theme['success'],
                                borderColor: Charts.colors.theme['success']
                            }]
                    }
                });

                new Chart($('#chart-transaction-compare'), {
                    type: 'pie',
                    data: {
                        labels: [ 'Tepat Waktu', 'Tunggakan' ],
                        datasets: [
                            {
                                data: [data.tepat, data.tunggakan],
                                backgroundColor: [
                                    Charts.colors.theme['success'],
                                    Charts.colors.theme['danger']
                                ]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        legend: {
                            position: 'top'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                })
            }
        })
    }

    /* STUDENT */
    $('#show-class').on('click', function () {
        tableStudent.ajax.url('/ajax/siswa?kelas=' + filterClass.val()).load(null, true)
    })
    filterClass.on('change', () => {
        tableStudent.ajax.url('/ajax/siswa?kelas=' + filterClass.val()).load(null, true)
    })
    filterStudent.on('change', () => {
        showStudent()
    })
    $('#show-student').on('click', function () {
        showStudent()
    })
    addStudent.on('click', function () {
        editedIndex = -1
        titleStudent.html('Tambah Siswa')
        $('#input-nis').val('')
        $('#input-name').val('')
        $('#input-gender').val(0)
        $('#input-class').val('')
        $('#input-school-year').val('')
        $('#input-religion').val('Islam')
        $('#input-student-type').val(0)
        $('#input-address').val('')
        fetchClass().then(() => {
            fetchSchoolYear().then(() => {
                modalStudent.modal('show')
            })
        })
    })
    formStudent.on('submit', function (e) {
        e.preventDefault()
        const data = {
            nis: $('#input-nis').val(),
            nama: $('#input-name').val(),
            jenis_kelamin: $('#input-gender').val(),
            kelas: $('#input-class').val(),
            tahun_ajaran: $('#input-school-year').val(),
            agama: $('#input-religion').val(),
            jenis_siswa: $('#input-student-type').val(),
            alamat: $('#input-address').val()
        }
        if (editedIndex > -1) {
            axios.put('/ajax/siswa/' + editedIndex, data).then(response => {
                if (response.data.status === 'OK') {
                    tableStudent.ajax.reload(null, false)
                    savedAlert()
                    modalStudent.modal('hide')
                } else unsavedAlert()
            }).catch(() => unsavedAlert())
        } else {
            axios.post('/ajax/siswa', data).then(response => {
                if (response.data.status === 'OK') {
                    tableStudent.ajax.reload(null, false)
                    savedAlert()
                    modalStudent.modal('hide')
                } else unsavedAlert()
            }).catch(() => unsavedAlert())
        }
    })
    tableStudent.on('click', '.edit-item', function () {
        editedIndex = $(this).data('id')
        titleStudent.html('Edit Siswa')
        fetchClass().then(() => {
            fetchSchoolYear().then(() => {
                fetchStudent(editedIndex)
            })
        })
    })
    tableStudent.on('click', '.delete-item', function () {
        editedIndex = $(this).data('id')
        removeConfirm().then(result => {
            if (result.value) {
                axios.delete('/ajax/siswa/' + editedIndex).then(response => {
                    if (response.data.status === 'OK') {
                        tableStudent.ajax.reload(null, false)
                        removedAlert()
                    } else unremovedAlert()
                }).catch(() => unremovedAlert())
            }
        })
    })
    function fetchStudents () {
        return new Promise(resolve => {
            axios.get('/ajax/siswa?kelas=').then(response => {
                if (response.data.status === 'OK') {
                    resolve(response)
                }
            })
        })
    }
    function fetchStudent (id) {
        axios.get('/ajax/siswa/' + id).then(response => {
            if (response.data.status === 'OK') {
                $('#input-nis').val(response.data.data.nis)
                $('#input-name').val(response.data.data.nama)
                $('#input-gender').val(response.data.data.jenis_kelamin)
                $('#input-class').val(response.data.data.id_kelas)
                $('#input-school-year').val(response.data.data.id_tahun_ajaran)
                $('#input-religion').val(response.data.data.agama)
                $('#input-student-type').val(response.data.data.jenis_siswa)
                $('#input-address').val(response.data.data.alamat)
                modalStudent.modal('show')
            }
        })
    }
    function showStudent() {
        const idStudent = filterStudent.val()
        resetMonths()
        axios.get('/ajax/siswa/' + idStudent).then(response => {
            if (response.data.status === 'OK') {
                $('#student-nis').html(response.data.data.nis)
                $('#student-name').html(response.data.data.nama)
                $('#student-address').html(response.data.data.alamat)
                const gender = response.data.data.jenis_kelamin === 0 ? 'Laki-Laki' : 'Perempuan'
                $('#student-gender').html(gender)
                $('#student-school-year').html(response.data.data.tahun_ajaran)
                $('#student-class').html(response.data.data.kelas)
                // refresh table
                transaction.student.nis = response.data.data.nis
                transaction.student.jenis = response.data.data.jenis_siswa
                refreshTransaction()
            }
        })
    }
    function fetchSchoolYear () {
        return new Promise(resolve => {
            axios.get('/ajax/tahun-ajaran').then(response => {
                if (response.data.status === 'OK') {
                    let html = ''
                    $.each(response.data.data, function (index, item) {
                        html += '<option value="' + item.id + '">' + item.tahun_ajaran + '</option>'
                    })
                    $('#input-school-year').html(html)
                    resolve(response)
                }
            })
        })
    }
    function fetchClass () {
        return new Promise(resolve => {
            axios.get('/ajax/kelas').then(response => {
                if (response.data.status === 'OK') {
                    let html = ''
                    $.each(response.data.data, function (index, item) {
                        html += '<option value="' + item.id + '">' + item.kelas + '</option>'
                    })
                    $('#input-class').html(html)
                    resolve(response)
                }
            })
        })
    }

    /* SETTING */
    formSchool.on('submit', function (e) {
        e.preventDefault()
        const data = {
            nama_sekolah: $('#school-name').val(),
            alamat_sekolah: $('#school-address').val(),
            kepala_sekolah: $('#school-head').val()
        }
        axios.put('/ajax/sekolah', data).then(response => {
            if (response.data.status === 'OK') {
                successAlert('Data sekolah berhasil diperbarui')
            } else failedAlert('Gagal memperbarui data sekolah')
        }).catch(() => failedAlert('Gagal memperbarui data sekolah'))
    })

    /* PROFILE */
    formProfile.on('submit', function (e) {
        e.preventDefault()
        const data = {
            name: $('#name').val(),
            password: $('#password').val()
        }
        axios.put('/profil', data).then(response => {
            if (response.data.status === 'OK') {
                successAlert('Profile berhasil diperbarui')
                $('#password').val('')
            } else failedAlert('Gagal memperbarui profile')
        }).catch(() => failedAlert('Gagal memperbarui profile'))
    })
    btnChangePassword.on('click', function () {
        modalChangePassword.modal('show')
    })
    formChangePassword.on('submit', function (e) {
        e.preventDefault()
        if (inputValid) {
            const data = {
                password_confirmation: $('#new-password-confirmation').val()
            }
            axios.put('/change-password', data).then(response => {
                if (response.data.status === 'OK') {
                    successAlert('Password berhasil diperbarui')
                    $('#new-password').val('')
                    $('#new-password-confirmation').val('')
                    modalChangePassword.modal('hide')
                } else failedAlert('Gagal memperbarui password')
            }).catch(() => failedAlert('Gagal memperbarui password'))
        }
    })
    formChangePassword.on('keyup', '#new-password-confirmation', function () {
        if ($(this).val() !== $('#new-password').val()) {
            $(this).addClass('is-invalid')
            inputValid = false
        } else {
            $(this).removeClass('is-invalid')
            inputValid = true
        }
    })

    /* SCHOOL YEAR */
    addSchoolYear.on('click', function () {
        editedIndex = -1
        $('#input-school-year').val('')
        titleSchoolYear.html('Tambah Tahun Ajaran')
        modalSchoolYear.modal('show')
    })
    formSchoolYear.on('submit', function (e) {
        const data = {
            tahun_ajaran: $('#input-school-year').val()
        }
        e.preventDefault()
        if (editedIndex > -1) {
            axios.put('/ajax/tahun-ajaran/' + editedIndex, data).then(response => {
                if (response.data.status === 'OK') {
                    tableSchoolYear.ajax.reload(null, false)
                    modalSchoolYear.modal('hide')
                    savedAlert()
                } else unsavedAlert()
            }).catch(() => unsavedAlert())
        } else {
            axios.post('/ajax/tahun-ajaran', data).then(response => {
                if (response.data.status === 'OK') {
                    tableSchoolYear.ajax.reload(null, false)
                    modalSchoolYear.modal('hide')
                    savedAlert()
                } else unsavedAlert()
            }).catch(() => unsavedAlert())
        }
    })
    tableSchoolYear.on('click', '.edit-item', function () {
        editedIndex = $(this).data('id')
        titleSchoolYear.html('Edit Tahun Ajaran')
        axios.get('/ajax/tahun-ajaran/' + editedIndex).then(response => {
            if (response.data.status === 'OK') {
                $('#input-school-year').val(response.data.data.tahun_ajaran)
                modalSchoolYear.modal('show')
            }
        })
    })
    tableSchoolYear.on('click', '.delete-item', function () {
        editedIndex = $(this).data('id')
        removeConfirm().then(result => {
            if (result.value) {
                axios.delete('/ajax/tahun-ajaran/' + editedIndex).then(response => {
                    if (response.data.status === 'OK') {
                        tableSchoolYear.ajax.reload(null, false)
                        removedAlert()
                    } else unremovedAlert()
                }).catch(() => unremovedAlert())
            }
        })
    })

    initializeView()

    /* ALERT */
    function savedAlert () {
        swal({
            title: 'Success',
            text: 'Data berhasil disimpan',
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success',
            timer: 1500
        })
    }
    function removedAlert () {
        swal({
            title: 'Success',
            text: 'Data berhasil dihapus',
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success',
            timer: 1500
        })
    }
    function successAlert (msg) {
        swal({
            title: 'Success',
            text: msg,
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success',
            timer: 1500
        })
    }
    function failedAlert (msg) {
        swal({
            title: 'Error',
            text: msg,
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-info',
            timer: 1500
        })
    }
    function removeConfirm () {
        return new Promise(resolve => {
            swal({
                title: 'Apa anda yakin?',
                text: "Perubahan tidak dapat dikembalikan!",
                type: 'warning',
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Ya',
                cancelButtonClass: 'btn btn-secondary',
                cancelButtonText: 'Batal',
                reverseButtons: true
            }).then(result => resolve(result))
        })
    }
    function unremovedAlert () {
        swal({
            title: 'Error',
            text: 'Gagal menghapus data',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-info',
            timer: 1500
        })
    }
    function unsavedAlert () {
        swal({
            title: 'Error',
            text: 'Gagal menyimpan data',
            type: 'error',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-info',
            timer: 1500
        })
    }

    /* INITIALIZER */
    function initializeView () {
        activateNav()
    }
    function activateNav () {
        const endpoint = window.location.pathname
        if (endpoint === '/tahun-ajaran') {
            $('#nav-tahun-ajaran').addClass('active')
        } else if (endpoint === '/siswa') {
            $('#nav-siswa').addClass('active')
            $('#tabel-siswa').DataTable()
        } else if (endpoint === '/dashboard') {
            $('#nav-dashboard').addClass('active')
            const totalTransactions = $('#total-transactions')
            totalTransactions.html(formatRupiah(totalTransactions.html(), 'Rp. '))
        } else if (endpoint === '/kelas') {
            $('#nav-kelas').addClass('active')
        } else if (endpoint === '/pembayaran') {
            $('#nav-pembayaran').addClass('active')
            initTransaction()
            generatePayment()
        } else if (endpoint === '/laporan') {
            $('#nav-laporan').addClass('active')
            initReport()
        }
    }
})

function generatePayment(type) {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear()
    if (month > parseInt($('#transaction-month').val()) || year > parseInt($('#transaction-year').val())) {
        $('#transaction-nominal').val(formatRupiah('110000', 'Rp. '))
    } else {
        $('#transaction-nominal').val(formatRupiah('100000', 'Rp. '))
    }
    if (type === 1)
        $('#transaction-nominal').val('BEASISWA GRATIS')
}

function formatRupiah(angka, prefix){
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi)
    if (ribuan){
        const separator = sisa ? '.' : ''
        rupiah += separator + ribuan.join('.')
    }
    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
    return prefix === undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '')
}
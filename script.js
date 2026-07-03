// Khai báo các biến DOM của Màn hình 1 (List)
const screenList = document.getElementById('screen-list');
const screenForm = document.getElementById('screen-form');
const btnMoForm = document.getElementById('btn-mo-form');
const bodyBang = document.getElementById('body-bang');

const sdNhanh = document.getElementById('sd-nhanh');
const tnNhanh = document.getElementById('tn-nhanh');
const ctNhanh = document.getElementById('ct-nhanh');

const tongThuHienThi = document.getElementById('tong-thu');
const tongChiHienThi = document.getElementById('tong-chi');
const soDuHienThi = document.getElementById('so-du');

// Khai báo các biến DOM của Màn hình 2 (Form)
const form = document.getElementById('form-giao-dich');
const formTitle = document.getElementById('form-title');
const btnSubmitText = document.getElementById('btn-submit-text');
const btnHuy = document.getElementById('btn-huy');

const gdIdInput = document.getElementById('giao-dich-id');
const tenInput = document.getElementById('ten');
const soTienInput = document.getElementById('so-tien');
const loaiSelect = document.getElementById('loai');
const ngayInput = document.getElementById('ngay');

// Lấy dữ liệu từ LocalStorage
let cacGiaoDich = JSON.parse(localStorage.getItem('giaoDichPro')) || [];

// Hàm định dạng ngày DD/MM/YYYY để hiển thị ra bảng giống mockup
function dinhDangNgayHienThi(chuoiNgay) {
    if (!chuoiNgay) return "";
    const [year, month, day] = chuoiNgay.split("-");
    return `${day}/${month}/${year}`;
}

// Hàm cập nhật và vẽ lại bảng giao diện
function capNhatGiaoDien() {
    bodyBang.innerHTML = '';
    let thuNhap = 0;
    let chiTieu = 0;

    cacGiaoDich.forEach((gd, index) => {
        const tr = document.createElement('tr');
        
        // Cột STT
        const tdStt = document.createElement('td');
        tdStt.innerText = index + 1;
        tr.appendChild(tdStt);

        // Cột Nội dung
        const tdNoiDung = document.createElement('td');
        tdNoiDung.innerText = gd.ten;
        tr.appendChild(tdNoiDung);

        // Cột Số tiền (+ hoặc -)
        const tdSoTien = document.createElement('td');
        if (gd.loai === 'thu') {
            tdSoTien.innerText = `+${gd.soTien.toLocaleString()}đ`;
            tdSoTien.className = 'txt-thu';
            thuNhap += gd.soTien;
        } else {
            tdSoTien.innerText = `-${gd.soTien.toLocaleString()}đ`;
            tdSoTien.className = 'txt-chi';
            chiTieu += gd.soTien;
        }
        tr.appendChild(tdSoTien);

        // Cột Loại nhãn (Badge màu)
        const tdLoai = document.createElement('td');
        const spanBadge = document.createElement('span');
        spanBadge.className = gd.loai === 'thu' ? 'badge badge-thu' : 'badge badge-chi';
        spanBadge.innerText = gd.loai === 'thu' ? 'Thu nhập' : 'Chi tiêu';
        tdLoai.appendChild(spanBadge);
        tr.appendChild(tdLoai);

        // Cột Ngày
        const tdNgay = document.createElement('td');
        tdNgay.innerText = dinhDangNgayHienThi(gd.ngay);
        tr.appendChild(tdNgay);

        // Cột Thao tác (Sửa và Xóa)
        const tdThaoTac = document.createElement('td');
        tdThaoTac.innerHTML = `
            <button class="btn-sua" onclick="chuanBiSua(${gd.id})"><i class="fa fa-pencil"></i></button>
            <button class="btn-xoa" onclick="xoaGiaoDich(${gd.id})"><i class="fa fa-trash"></i></button>
        `;
        tr.appendChild(tdThaoTac);

        bodyBang.appendChild(tr);
    });

    // Tính toán số dư
    const soDu = thuNhap - chiTieu;

    // Gán giá trị vào các ô hiển thị ở Màn hình 1
    const txtThuNhap = thuNhap.toLocaleString() + 'đ';
    const txtChiTieu = chiTieu.toLocaleString() + 'đ';
    const txtSoDu = soDu.toLocaleString() + 'đ';

    sdNhanh.innerText = txtSoDu;
    tnNhanh.innerText = txtThuNhap;
    ctNhanh.innerText = txtChiTieu;

    tongThuHienThi.innerText = thuNhap.toLocaleString();
    tongChiHienThi.innerText = chiTieu.toLocaleString();
    soDuHienThi.innerText = soDu.toLocaleString();
}

// Xử lý sự kiện lưu Form (Thêm hoặc Sửa)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const idGiaoDich = gdIdInput.value;
    const giaoDichData = {
        id: idGiaoDich ? parseInt(idGiaoDich) : Date.now(), // Nếu sửa giữ nguyên id, nếu tạo mới lấy thời gian thực làm ID độc nhất
        ten: tenInput.value,
        soTien: parseFloat(soTienInput.value),
        loai: loaiSelect.value,
        ngay: ngayInput.value
    };

    if (idGiaoDich) {
        // TÍNH NĂNG SỬA: Tìm và thay thế phần tử cũ bằng phần tử mới
        cacGiaoDich = cacGiaoDich.map(gd => gd.id === parseInt(idGiaoDich) ? giaoDichData : gd);
    } else {
        // TÍNH NĂNG THÊM MỚI: Đẩy vào mảng
        cacGiaoDich.push(giaoDichData);
    }

    localStorage.setItem('giaoDichPro', JSON.stringify(cacGiaoDich));
    capNhatGiaoDien();
    dongForm();
});

// Chuyển sang màn hình thêm mới
btnMoForm.addEventListener('click', () => {
    form.reset();
    gdIdInput.value = ''; // Reset ID ẩn
    formTitle.innerHTML = '<i class="fa fa-plus"></i> Thêm giao dịch mới';
    btnSubmitText.innerText = 'Lưu giao dịch';
    
    // Đặt ngày mặc định cho form là ngày hôm nay
    const homNay = new Date().toISOString().split('T')[0];
    ngayInput.value = homNay;

    screenList.classList.add('hidden');
    screenForm.classList.remove('hidden');
});

// Quay lại màn hình danh sách khi bấm hủy
function dongForm() {
    screenForm.classList.add('hidden');
    screenList.classList.remove('hidden');
}
btnHuy.addEventListener('click', dongForm);

// TÍNH NĂNG SỬA: Đổ dữ liệu vào form để sửa
window.chuanBiSua = function(id) {
    const gdCanSua = cacGiaoDich.find(gd => gd.id === id);
    if (!gdCanSua) return;

    gdIdInput.value = gdCanSua.id;
    tenInput.value = gdCanSua.ten;
    soTienInput.value = gdCanSua.soTien;
    loaiSelect.value = gdCanSua.loai;
    ngayInput.value = gdCanSua.ngay;

    formTitle.innerHTML = '<i class="fa fa-pencil"></i> Chỉnh sửa giao dịch';
    btnSubmitText.innerText = 'Lưu thay đổi';

    screenList.classList.add('hidden');
    screenForm.classList.remove('hidden');
}

// TÍNH NĂNG XÓA
window.xoaGiaoDich = function(id) {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
        cacGiaoDich = cacGiaoDich.filter(gd => gd.id !== id);
        localStorage.setItem('giaoDichPro', JSON.stringify(cacGiaoDich));
        capNhatGiaoDien();
    }
}

// Khởi chạy dữ liệu ngay khi mở ứng dụng
capNhatGiaoDien();
const form = document.getElementById('form-giao-dich');
const tenInput = document.getElementById('ten');
const soTienInput = document.getElementById('so-tien');
const loaiSelect = document.getElementById('loai');
const danhSach = document.getElementById('danh-sach');
const soDuHienThi = document.getElementById('so-du');
const tongThuHienThi = document.getElementById('tong-thu');
const tongChiHienThi = document.getElementById('tong-chi');

// Lấy dữ liệu cũ từ LocalStorage (nếu có), nếu không có thì tạo mảng rỗng
let cacGiaoDich = JSON.parse(localStorage.getItem('giaoDich')) || [];

function capNhatGiaoDien() {
    danhSach.innerHTML = '';
    let thuNhap = 0;
    let chiTieu = 0;

    cacGiaoDich.forEach((gd) => {
        const li = document.createElement('li');
        li.classList.add(gd.loai);
        li.innerHTML = `${gd.ten} <span>${gd.loai === 'thu' ? '+' : '-'}${Number(gd.soTien).toLocaleString()}đ</span>`;
        danhSach.appendChild(li);

        if (gd.loai === 'thu') thuNhap += gd.soTien;
        else chiTieu += gd.soTien;
    });

    tongThuHienThi.innerText = thuNhap.toLocaleString();
    tongChiHienThi.innerText = chiTieu.toLocaleString();
    soDuHienThi.innerText = (thuNhap - chiTieu).toLocaleString();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // ĐÃ SỬA: Viết liền tên biến giaoDichMoi
    const giaoDichMoi = {
        ten: tenInput.value,
        soTien: parseFloat(soTienInput.value),
        loai: loaiSelect.value
    };

    cacGiaoDich.push(giaoDichMoi);
    localStorage.setItem('giaoDich', JSON.stringify(cacGiaoDich)); // Lưu vào máy
    capNhatGiaoDien();
    form.reset();
});

// Chạy lần đầu khi mở trang web
capNhatGiaoDien();
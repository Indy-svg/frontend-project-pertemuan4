const getEl = (id) => document.getElementById(id);

const getStockStatus = (stock) => (stock >= 15 ? 'Stok Aman' : 'Stok Menipis');

const getFormValues = () => ({
  name: getEl('product-name').value.trim(),
  category: getEl('product-category').value,
  price: parseFloat(getEl('product-price').value),
  stock: parseInt(getEl('product-stock').value, 10),
});

const validateProduct = ({ name, category, price, stock }) => {
  const errors = {};
  if (!name) {
    errors['product-name'] = 'Nama produk wajib diisi.';
  } else if (productDataset.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    errors['product-name'] = 'Nama produk sudah ada.';
  }
  if (!category) errors['product-category'] = 'Pilih kategori.';
  if (isNaN(price) || price < 1000) errors['product-price'] = 'Harga minimal Rp1.000.';
  if (isNaN(stock) || stock < 0) errors['product-stock'] = 'Stok tidak valid.';
  return { errors, valid: Object.keys(errors).length === 0 };
};

const showFeedback = (el, message, type) => {
  el.textContent = message;
  el.className = `feedback-msg ${type}`; // type: 'success' atau 'error'
};

const clearInvalidMarks = () =>
  document.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));

const markInvalid = (errors) =>
  Object.keys(errors).forEach((id) => getEl(id).classList.add('invalid'));

// ===== LIVE PREVIEW =====
const setPreview = (id, text, placeholder) => {
  const el = getEl(id);
  el.textContent = text || placeholder;
  el.classList.toggle('muted', !text);
};

const updatePreview = () => {
  const { name, category, price, stock } = getFormValues();
  setPreview('preview-name', name, 'Belum diisi');
  setPreview('preview-category', category, 'Belum dipilih');
  setPreview('preview-price', isNaN(price) ? '' : formatRupiah(price), 'Belum diisi');
  setPreview('preview-stock', isNaN(stock) ? '' : `${stock} (${getStockStatus(stock)})`, 'Belum diisi');
};

// ===== RENDER TABEL, FILTER, REKAP =====
const createCell = (text) => {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
};

const renderFilterOptions = () => {
  const select = getEl('filter-category');
  const current = select.value;
  const categories = [...new Set(productDataset.map((p) => p.category))];

  select.replaceChildren();
  const all = document.createElement('option');
  all.value = '';
  all.textContent = 'Semua kategori';
  select.appendChild(all);

  categories.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
  select.value = categories.includes(current) ? current : '';
};

const renderTable = () => {
  const selected = getEl('filter-category').value || null;
  const { products } = filterProducts(productDataset, selected); // dari logic.js
  const tbody = getEl('product-table-body');
  tbody.replaceChildren();

  products.forEach((p) => {
    const tr = document.createElement('tr');
    [p.id, p.name, p.category, formatRupiah(p.price), p.stock, getStockStatus(p.stock)]
      .forEach((v) => tr.appendChild(createCell(v)));
    tbody.appendChild(tr);
  });
  getEl('product-count').textContent = products.length;
};

const renderRecap = () => {
  const { totalProducts, totalItems, totalStockValue } = calculateTotalStockValue(productDataset); // dari logic.js
  const list = getEl('recap-list');
  list.replaceChildren();
  [
    `Jumlah produk: ${totalProducts}`,
    `Total unit stok: ${totalItems}`,
    `Total nilai stok: ${formatRupiah(totalStockValue)}`,
  ].forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
};

const refreshView = () => {
  renderFilterOptions();
  renderTable();
  renderRecap();
};

// ===== SUBMIT =====
const handleSubmit = (event, form, feedback) => {
  event.preventDefault(); // cegah reload

  clearInvalidMarks();
  const values = getFormValues();
  const { errors, valid } = validateProduct(values);

  if (!valid) {
    markInvalid(errors);
    showFeedback(feedback, 'Gagal: ' + Object.values(errors).join(' '), 'error');
    return;
  }

  const newProduct = { id: productDataset.length + 1, ...values };
  productDataset.push(newProduct);
  console.log('Data produk berhasil ditambahkan:', newProduct);

  showFeedback(feedback, `Sukses! Produk '${newProduct.name}' (${formatRupiah(newProduct.price)}) tersimpan.`, 'success');

  refreshView();   // perbarui tabel + rekap
  form.reset();    // kosongkan form
  updatePreview(); // kosongkan preview
};

// ===== INISIALISASI =====
document.addEventListener('DOMContentLoaded', () => {
  const form = getEl('product-form');
  const feedback = getEl('form-feedback');

  form.addEventListener('submit', (event) => handleSubmit(event, form, feedback));

  ['product-name', 'product-price', 'product-stock'].forEach((id) =>
    getEl(id).addEventListener('input', updatePreview));
  getEl('product-category').addEventListener('change', updatePreview);
  getEl('filter-category').addEventListener('change', renderTable);

  refreshView(); 
});
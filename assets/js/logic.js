// 1. Dataset Mock Produk UMKM (minimal 8 produk)
const productDataset = [
    {
        id: 1,
        name: "Keripik Mangrove",
        category: "Makanan",
        price: 15000,
        stock: 20
    },
    {
        id: 2,
        name: "Blueberry Cheesecake",
        category: "Dessert",
        price: 30000,
        stock: 15
    },
    {
        id: 3,
        name: "Batik Gajah Oling",
        category: "Fashion",
        price: 150000,
        stock: 8
    },
    {
        id: 4,
        name: "Butterscotch Coffe",
        category: "Minuman",
        price: 25000,
        stock: 30
    },
    {
        id: 5,
        name: "Dimsum Mentai",
        category: "Makanan",
        price: 22000,
        stock: 25
    },
    {
        id: 6,
        name: "Tas Anyaman Bambu",
        category: "Kerajinan",
        price: 85000,
        stock: 10
    },
    {
        id: 7,
        name: "Mochi Bites",
        category: "Camilan",
        price: 18000,
        stock: 40
    },
    {
        id: 8,
        name: "Smoothies",
        category: "Minuman",
        price: 20000,
        stock: 12
    }
];
console.log(productDataset);

// Fungsi bantu: format angka menjadi Rupiah (contoh: Rp15.000)
const formatRupiah = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
};

// 2a. Fungsi Filter Produk (berdasarkan kategori dan/atau rentang harga)
// Parameter yang tidak diisi memakai nilai default (fitur ES6)
const filterProducts = (products, filterCategory = null, minPrice = 0, maxPrice = Infinity) => {

    console.log(`=== Menjalankan Filter Produk ===`);
    console.log(`Kategori: ${filterCategory === null ? "Semua" : filterCategory} | Harga: ${formatRupiah(minPrice)} - ${maxPrice === Infinity ? "tanpa batas" : formatRupiah(maxPrice)}`);

    const filteredProducts = [];

    for (const product of products) {
        // Evaluasi kondisi menggunakan Strict Equality (===)
        const isCategoryMatch = filterCategory === null || product.category === filterCategory;
        const isPriceMatch = product.price >= minPrice && product.price <= maxPrice;

        if (isCategoryMatch && isPriceMatch) {
            filteredProducts.push(product);

            // Evaluasi status stok dengan Ternary Operator
            const stockStatus = product.stock >= 15 ? "Stok Aman" : "Stok Menipis";
            console.log(`[ID: ${product.id}] ${product.name} (${product.category}) - Harga: ${formatRupiah(product.price)} - Stok: ${product.stock} (${stockStatus})`);
        }
    }

    if (filteredProducts.length === 0) {
        console.log("Tidak ada produk yang cocok.");
    }

    return {
        category: filterCategory,
        totalProducts: filteredProducts.length,
        products: filteredProducts
    };
}

// 2b. Fungsi Kalkulasi Total Valuasi Stok
const calculateTotalStockValue = (products) => {

    console.log(`=== Menghitung Total Nilai Stok ===`);

    let totalStockValue = 0;
    let totalItems = 0;

    for (const product of products) {
        // Nilai stok = harga x jumlah stok
        const stockValue = product.price * product.stock;
        totalStockValue += stockValue;
        totalItems += product.stock;

        console.log(`${product.name}: ${formatRupiah(product.price)} x ${product.stock} = ${formatRupiah(stockValue)}`);
    }

    return {
        totalProducts: products.length,
        totalItems: totalItems,
        totalStockValue: totalStockValue
    };
}

// 3. Eksekusi Fungsi & Output Console

// Filter berdasarkan kategori
const foodResult = filterProducts(productDataset, "Makanan");
console.log("Hasil Filter Kategori:", foodResult);
console.log(`Jumlah produk Makanan: ${foodResult.totalProducts}`);

// Filter berdasarkan rentang harga
const priceResult = filterProducts(productDataset, null, 20000, 90000);
console.log(`Jumlah produk harga Rp20.000 - Rp90.000: ${priceResult.totalProducts}`);

// Total valuasi stok seluruh produk
const stockResult = calculateTotalStockValue(productDataset);
console.log("Hasil Rekapitulasi:", stockResult);
console.log(`Total nilai stok: ${formatRupiah(stockResult.totalStockValue)}`);